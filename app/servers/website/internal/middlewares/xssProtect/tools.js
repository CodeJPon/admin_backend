const createDOMPurify  = require('dompurify');
const { JSDOM } = require('jsdom');
const window = new JSDOM('').window;
const xssFilters = createDOMPurify(window);
const _ = require('lodash');

module.exports = {
    // 掃描所有API
    ScanAll: function (req, res, next, items) {
        const isAllXssItems = tools.withNoIgnore(items);
        if (isAllXssItems.length > 0) {
            tools.xssResponse(req, res, isAllXssItems, '侦测到有XSS内容');
        } else {
            next();
        }
    },
    // 針對特定API掃描
    ScanCustomer: function (req, res, next, items, checkXssParam) {
        const isCustomerXssItems = tools.xssCheckCustomerFilter(items, checkXssParam.ignoreKey);
        if (isCustomerXssItems.length > 0) {
            tools.xssResponse(req, res, isCustomerXssItems, '侦测到有XSS内容');
        } else {
            next();
        }
    }
};

// 私有方法
const tools = {

    withNoIgnore: (reqItems)=>{
        const result = [];
        reqItems.forEach(item=>{
            const filterObjs = Object.keys(item.val);
            filterObjs.forEach(function (x) {
                const xssRecord =   tools.filterProcess(item, x);
                if (xssRecord !== undefined) {
                    result.push(xssRecord);
                }
            });
        });

        return result;
    },
    haveIgnore: (reqItems, ignoreItem)=>{
        const result = [];
        reqItems.forEach(item=>{
            let filterObjs ;
            if (item.type === 'body' || item.type === 'query' ) {
                filterObjs = Object.keys(item.val).filter(id => !ignoreItem.includes(id));
            } else {
                filterObjs = Object.keys(item.val);
            }
            filterObjs.forEach(function (x) {
                const xssRecord =  tools.filterProcess(item, x);
                if (xssRecord !== undefined) {
                    result.push(xssRecord);
                }
            });
        });
        return result;
    },
    filterProcess: function (items, key) {
        let result = undefined;

        const typeConditions = [
            {typeName: 'number'},
            {typeName: 'boolean'}
        ];

        const checkType = _.find(typeConditions,   function (o) {
            return o.typeName === typeof items.val[key];
        });

        if (checkType !== undefined) {
            return result;
        }


        if (typeof items.val[key] === 'object') {
            const jsonStr = JSON.stringify(items.val[key]);
            const sanitizeStr = xssFilters.sanitize(jsonStr, {ALLOWED_TAGS: []});
            if (jsonStr !== sanitizeStr) {

                result = {name: 'jsonObj', type: 'json', value: encodeURIComponent(jsonStr)};
                return result;
            }
        } else {
            if (items.val[key] !== xssFilters.sanitize(items.val[key], {ALLOWED_TAGS: []})) {
                result = {name: key, type: items.type, value: encodeURIComponent(items.val[key])};
                return result;
            }
        }
    },
    xssLogFormat: (items)=>{
        const header = 'XSS內容如下';
        let body = '';
        items.forEach(function (x) {
            body += `類型:${x.type} , 參數名稱:${x.name} , 傳入參數內容:${x.value}!`;
        });
        return `${header}:${body}`;
    },
    sqlFormat: (sqlStr)=>{
        return  sqlStr.replace('--', '')
            .replace('/*', '')
            .replace('substring', '')
            .replace(';', '')
            .replace('script', '')
            .replace('\'', '');


    },
    xssCheckCustomerFilter: function (reqItems, ignoreItem) {

        if (ignoreItem.length > 0) {
            return  tools.haveIgnore(reqItems, ignoreItem);

        } else {
            return  tools.withNoIgnore(reqItems);
        }
    },
    xssResponse: (req, res, xssItems, resText)=>{
        const logTxt = tools.xssLogFormat(xssItems);
        logger.warn(`偵測到XSS,路徑:${req.originalUrl.replace('/', '')},內容:${tools.sqlFormat(logTxt) }`);
        res.json({ code: 1, message: resText});
    },
};
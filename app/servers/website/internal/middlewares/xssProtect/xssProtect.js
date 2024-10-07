const _ = require('lodash');
const s = require('../../../../../configs/xssIgnore');
const xssToos = require('./tools');

module.exports = async function (req, res, next) {
    const method = req.method.toLowerCase();
    const url = req.originalUrl.split('?')[0];
    const filterItems = [
        {type: 'body', val: req.body},
        {type: 'query', val: req.query},
        {type: 'params', val: req.params},
        {type: 'headers', val: req.headers},
        {type: 'cookies', val: req.cookies}
    ];

    const checkXssParam = _.find(s.adapters,  await function (o) {
        return o.url === url && o.method === method;
    });
    const xssScanTypes = checkXssParam === undefined ? 'ScanAll' : 'ScanCustomer';
    xssToos[xssScanTypes](req, res, next, filterItems, checkXssParam);
};


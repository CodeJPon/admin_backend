const NumberExtension = function () {

};

/**
 * 将分数转为金额
 * @param {number} score
 * @return {number} 金额
 * */
NumberExtension.prototype.parseToMoney = function (score) {
    if (typeof score === 'string') {
        score = score.toNumber();
    }
    score = +score || 0;
    return score.toCurrency();
};

/**
 * 将金额转为分数
 * @param {number} currency
 * @return {number} 分数
 * */
NumberExtension.prototype.parseToScore = function (currency) {
    if (typeof currency === 'string') {
        currency = currency.toNumber();
    }
    currency = +currency || 0;
    return  currency.toScore();
};

/**
 * 将分数脱敏成文字
 * @param {number} value 要脱敏的数值 default:0
 * @param {boolean} isAgent 是否为代理 default:false
 * @return {string} 脱敏后的数字文字化
 * */
NumberExtension.prototype.displayNumByIdentity = function (value, isAgent = false) {
    if (typeof value === 'string') {
        value = value.toNumber();
    }
    value = +value || 0;
    try {
        const t =  value.toDisplayDesensitization(isAgent);
        return t;
    } catch (error) {
        console.log(error);
    }
};

/**
 * 将小数点向左偏移${decimal}位数，并四舍五入到小数点第${decimal}位数，并输出带有千分位符号的数字文字
 * @param {number} value  传入的要被操作的分数值
 * @param {number} decimal  是否为代理
 * @return {string} 带有千分位符号的数字文字
 * @example formatScoreDecimal(1234561234567.46 , 1) => 123,456,123,456.7
 * */
NumberExtension.prototype.formatByDecimal = function (value, decimal = 0) {
    if (typeof value === 'string') {
        value = value.toNumber();
    }
    value = +((+value || 0).toFixed(decimal));
    return value.toFormat(decimal);
};

/**
 * 将分数脱敏
 * @param {number} value 分数
 * @param {boolean} isAgent 是否为代理 1:是 (不脱敏) | 0:否 (脱敏)
 * @return {number}
 * */
NumberExtension.prototype.desensitizationNumber = function (value, isAgent = false) {
    if (typeof value === 'string') {
        value = value.toNumber();
    }
    value = +value || 0;
    return value.toDesensitization(isAgent);
};

/**
 * 將文字化數字轉回數字
 * @param {string} value
 * @returns {number}
 * @example parseDisplayToNumber('1,2345.678') => 12345.678
 * */
NumberExtension.prototype.parseDisplayToNumber = function (value) {
    return value.toNumber();
};
let m;
if (typeof module !== 'undefined') {
    m = m ?? new NumberExtension();
    module.exports = m;
}



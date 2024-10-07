/**
 * 依照Format格式，将Number文字化
 * @param {string} v 要格式化的文字
 * @param {string} pattern 格式化规格
 * @returns {string}
 * @example formatNumber(100,'#,##0')
 * */
function formatNumber (v, pattern) {
  if (!v && +v !== 0) {
      return v;
  }

  const strArr = v ? v.toString().split('.') : ['0'];
  const fmtArr = pattern ? pattern.split('.') : [''];
  let retStr = '';
  // 整数部分
  let str = strArr[0];
  let fmt = fmtArr[0];
  let i = str.length - 1;
  let comma = false;
  for (let f = fmt.length - 1; f >= 0; f--) {
      switch (fmt.substr(f, 1)) {
          case '#':
              if (i >= 0) retStr = str.substr(i--, 1) + retStr;
              break;
          case '0':
              if (i >= 0) retStr = str.substr(i--, 1) + retStr;
              else retStr = '0' + retStr;
              break;
          case ',':
              comma = true;
              retStr = ',' + retStr;
              break;
      }
  }
  if (i >= 0) {
      if (comma) {
          const l = str.length;
          for (; i >= 0; i--) {
              retStr = str.substr(i, 1) + retStr;
              if (i > 0 && ((l - i) % 3) === 0) retStr = ',' + retStr;
          }
      } else retStr = str.substr(0, i + 1) + retStr;
  }
  retStr = retStr + '.';
  // 处理小数部分
  str = strArr.length > 1 ? strArr[1] : '';
  fmt = fmtArr.length > 1 ? fmtArr[1] : '';
  i = 0;
  for (let f = 0; f < fmt.length; f++) {
      switch (fmt.substr(f, 1)) {
          case '#':
              if (i < str.length) retStr += str.substr(i++, 1);
              break;
          case '0':
              if (i < str.length) retStr += str.substr(i++, 1);
              else retStr += '0';
              break;
      }
  }
  return retStr.replace(/^,+/, '').replace(/\.$/, '');
}

function formatScientificNumber (number) {
  const numberString = number.toString();

  // 若字串包含科學計數法表示(e)，則進行處理
  if (numberString.includes('e')) {
      let [coefficient, exponent] = numberString.split('e');
      exponent = parseInt(exponent); // 解析指數部分

      // 指數部分為負數時
      if (exponent < 0) {
          const zeros = '0'.repeat(Math.abs(exponent) - 1);
          return '0.' + zeros + coefficient.replace('.', '');
      }

      // 指數部分為正數或零時
      const decimalIndex = coefficient.indexOf('.');
      if (decimalIndex === -1) {
          coefficient += '0'.repeat(exponent);
      } else {
          const decimalPart = coefficient.substring(decimalIndex + 1);
          coefficient = coefficient.substring(0, decimalIndex) + decimalPart;
          if (exponent >= decimalPart.length) {
              coefficient += '0'.repeat(exponent - decimalPart.length);
          } else {
              coefficient = coefficient.substring(0, decimalIndex + exponent) + '.' + coefficient.substring(decimalIndex + exponent);
          }
      }

      return coefficient;
  }

  return numberString; // 若不包含科學計數法表示，則返回原始字串
}

/**
 * 将小数点向左偏移${decimal}位数，并四舍五入到小数点第${decimal}位数，并输出带有千分位符号的数字文字
 * @param {number} fractionDigits 以10为底的对数
 * @returns {string} 带有千分位符号的数字文字
 * @example formatScoreDecimal(1234561234567.46 , 1) => 123,456,123,456.7
 * */
Number.prototype.toFormat = function (fractionDigits = 0) {
  fractionDigits = Math.abs(fractionDigits);
  const sign = this < 0 ? '-' : '';
  let floatStr = fractionDigits === 0 ? '' : '.';
  floatStr = floatStr.padEnd(fractionDigits === 0 ? 0 : fractionDigits + 1, '0');

  return sign + formatNumber(Math.abs(this), '#,##0' + floatStr);
};

/**
* 文字化数字转成Number
* @param {string} target 文字化数字
* @returns {number | NaN}
* */
Number.parse = function (target) {
  if (typeof target === 'number') return +target;
  else if (typeof target !== 'string') return NaN;
  else if (!target || target === '') return 0;
  return (parseFloat(target.replaceAll(',', '')) || 0);
};

/**
* 将文字转换成数字，预设为0
* @return {number}
* */
String.prototype.toNumber = function () {
  return (parseFloat(this.replaceAll(',', '')) || 0);
};


/**
* @param {number} length
* ex: (5.5499).toFixed(1)
* ex: (1.005).toFixed(2)
* ex: (21.505 + 33.47).toFixed(2)
* */
Number.prototype.toFixed = function (length) {
  let thiz = this;
  if (thiz % 1 !== 0) {
      thiz = parseFloat(thiz.toPrecision(15));
  }
  const t = Math.pow(10, length);
  let nv = thiz * t;
  if (nv % 1 !== 0) {
      nv = parseFloat(nv.toPrecision(15));
  }
  const result = Math.round(nv) / t;
  // 补零
  if (length === 0) {
      return result.toString();
  } else {
      const splitString = result.toString().split('.');
      if (splitString.length === 1) {
          return `${result}${'.'.padEnd(length + 1, '0')}`;
      } else if (splitString.length === 2 && length - splitString[1].length > 0) {
          return result.toString() + ''.padEnd(length - splitString[1].length, '0');
      } else {
          return result.toString();
      }
  }
};

/**
* 乘法
* */
Number.prototype.mulFloat = function (num) {
  let m = 0;
  const s1 = formatScientificNumber(this);
  const s2 = formatScientificNumber(num.toString());
  try {
      m += s1.split('.')[1].length;
  } catch (e) { }
  try {
      m += s2.split('.')[1].length;
  } catch (e) { }

  return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m);
};

/**
* 除法
* @param {number} denominator 除数(分母)
* */
Number.prototype.divFloat = function (denominator) {
  let e = 0, f = 0;
  try {
      e = formatScientificNumber(this).split('.')[1].length;
      // e = this.toString().split('.')[1].length;
  } catch (error) {
  }

  try {
      f = denominator.toString().split('.')[1].length;
  } catch (error) {
  }

  const c = Number(this.toString().replace('.', ''));
  const d = Number(denominator.toString().replace('.', ''));
  return (c / d).mulFloat(Math.pow(10, f - e));
};

/**
* 無條件捨去至第N位
* @param {number} digital 無條件捨去至小數點第幾位
* */
Number.prototype.roundDown = function (digital) {
  if (isNaN(+digital)) {
      return 0;
  }
  digital = +digital;
  const calc = Math.floor(this.mulFloat(Math.pow(10, digital)));
  return (calc.divFloat(Math.pow(10, digital)));
};

/**
 * 添加Number外挂
 * @param {number} digital
 * */
function addNumberExtension (digital = 100) {
  let logNumber = Math.floor(Math.log10(Math.abs(digital))) || 2;
  if (logNumber < 2) logNumber = 2;
  /**
   * 币转换成原币
   * @return {number} 原币
   * */
  Number.prototype.toScore = function () {
      return this.mulFloat(Math.pow(10, logNumber));
  };
  /**
   * 原币转换成币
   * @return {number} 币
   * */
  Number.prototype.toCurrency = function () {
      const sign = this < 0 ? -1 : 1;
      const val = Math.abs(this).divFloat(Math.pow(10, logNumber));
      return sign * val;
  };

  /**
   * 数字脱敏处理 ( 除以 1000 )
   * @return {number} 脱敏后的数字
   * */
  Number.prototype.desensitization = function () {
      const sign = this < 0 ? -1 : 1;
      const tt = Math.abs(this).divFloat(Math.pow(10, 3));
      return sign.mulFloat(tt);
  };

  /**
   * 原币脱敏数值
   * @param{boolean} isAgent 是否为代理
   * @returns {number} 原币脱敏后的数值
   * */
  Number.prototype.toDesensitization = function (isAgent = false) {
      const currency = this.toCurrency();
      // const result = isAgent ? currency.toFixed(2) : currency.desensitization().toFixed(5);
      const result = isAgent ? currency.roundDown(2) : currency.desensitization().roundDown(5);
      return parseFloat(result);
  };

  /**
   * 原币脱敏并且文字化
   * @param {boolean} isAgent
   * @return {string} 脱敏币值
   * */
  Number.prototype.toDisplayDesensitization = function (isAgent = false) {
      const sign = this < 0 ? -1 : 1;
      const currency = sign * Math.abs(this).toDesensitization(isAgent);
      // const result = +(isAgent ? currency.toFixed(2) : currency.toFixed(5));
      const result = +(isAgent ? currency.roundDown(2) : currency.roundDown(5));
      return isAgent ? result.toFormat(2) : result.toFormat(5);
  };

  /**
   * 根據身分(是否為代理) 轉換 会员/代理 的余额(可下分数) 為千分位數值字串
   * @param {number} score 分数
   * @param {boolean} isAgent 是否为代理
   * @return {string} 回传无条件舍去后的余额 (可提领的最大面额)
   * */
  Number.parseToBalanceDesensitizeString = function (score, isAgent = false) {
      const digit = isAgent ? 0 : 3;
      score = +score || 0;
      const currency = score.toCurrency();
      const desCurrency = currency.divFloat(Math.pow(10, digit));
      return desCurrency.roundDown(digit + 2).toFormat(digit + 2);
  };

}

if (typeof module !== 'undefined') {
  addNumberExtension(require('../servers/website/internal/configs/manage').mToScoreRate);
}
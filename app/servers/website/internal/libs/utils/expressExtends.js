const expressExtends = {};

/**
 * 取得請求者的ip位置
 * @description 透過 headers[x-real-ip] | headers[x-domain-name] | req.socket.remoteAddress 取得
 * @param {object} req 要求物件
 * @return {string} ip
 * @example getIp (req)
 */
expressExtends.getIp = function (req) {
    let ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket.remoteAddress || '';
    const ips = ip.split(',');
    if (ips.length > 0) {
        if (ips !== '::1') {
            ip = ips[ips.length - 1].trim();
        } else {
            ip = '127.0.0.1';
        }
    }
    return ip.replace(/::ffff:/, '');
};

/**
 * 取得請求者的url
 * @description 透過 req.headers.referer 取得
 * @param {object} req 要求物件
 * @return {string} ip
 * @example getUrl (req)
 */
expressExtends.getUrl = function (req) {
    return req.headers.referer;
};

module.exports = expressExtends;

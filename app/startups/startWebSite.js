// 處理未捕獲到的異常事件(Node.js 程序中發生未處理的異常（即沒有使用 try-catch 處理的錯誤）時觸發)
process.on('uncaughtException', function (err) {
    console.error(' Caught exception: ' + err.stack);
    // 通常會讓程序退出，避免異常狀態繼續
    process.exit(1);
});
// 通常，當一個 Promise 產生錯誤或拒絕（rejection）時，
// 應該用 .catch() 方法來捕獲並處理該錯誤。如果某個 Promise 被拒絕但沒有相應的 .catch() 處理器，就會觸發 unhandledRejection 事件
process.on('unhandledRejection', (reason, p) => {
    console.error('Caught Unhandled Rejection at:' + p + 'reason:' + reason.stack);
});

const web = require('../servers/website/server');
web.start();

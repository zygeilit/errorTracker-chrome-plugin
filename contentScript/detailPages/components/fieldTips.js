var Tip = require('./tip')
var Store = require('./store')

function exceptionType() {
    var label = $(".form-breakword .padleft20 .form-group:eq(3) >label");
    label.css({ 'display': 'inline-flex' });
    (new Tip({
        collection: [

        ],
        target: label
    })).init();
}

function message() {
    var label = $("td.details ul.li-items li:eq(4) .li-item-text");
    (new Tip({
        collection: [
            '提供给项目的可扩展字段, 可配置<b>TMS-ET-SDK</b>的<a href="http://../components/sdk#getFieldsFormatter" target="_blank">getFielsFormatter</a>函数实现自定义扩展'
        ],
        target: label
    })).init();
}

function stacklist() {
    var label = $("td.details ul.li-items li:eq(7) .li-item-text");
    (new Tip({
        collection: [
            
        ],
        target: label
    })).init();
}

module.exports = {
    exceptionType: exceptionType,
    message: message,
    stacklist: stacklist
}
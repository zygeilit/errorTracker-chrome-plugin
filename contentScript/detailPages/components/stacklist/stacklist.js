var ProcessBar = require('./../progressbar')
var Stack = require('./stack')

var Stacklist = function(options) {

    this.appName = options.appName;
    this.errorId = options.errorId;
    this.url = 'http://10.129.7.116:3000/getFormatedStack'; //
    this.stacklist = [];
    this.container = options.container; // $("<table class='et-detail-stackTrace-container'/>");
};

Stacklist.prototype = {

    getErrorDetails: function(opt) {
        var self = this;
        var deferred = new $.Deferred();

        // 初始化进度条
        var processBar = new ProcessBar({ container: this.container });
        self.refresh(processBar.$el);
        processBar.load();

        $.ajax({
            'url': opt.url,
            'type': 'GET',
            'data': opt.data,
            'success': function(resp) {
                if(resp.code !== 200) {
                    deferred.reject(resp);
                } else {
                    deferred.resolve(resp.data)
                }
            },
            'error': function(resp) {
                deferred.reject(resp)
            }
        });

        return deferred.promise();
    },

    init: function() {
        var self = this;
        var deferred = new $.Deferred();

        self.getErrorDetails({
                url: this.url,
                data: {
                    'appName': self.appName,
                    'errorId': self.errorId
                }
            })
            .done(function(resp) {
                self.stacklist = self.format(resp);
                var context = self.html();
                self.refresh(context);
                deferred.resolve(resp);
            })
            .fail(function(resp) {
                var code = resp.code;
                var data = resp.data;
                if(!resp) {
                    self.refresh($('<span>请求超时,等待时间:60s</span>'));
                    return;
                }
                // script error || col:-1 || line:-1
                if(code && (code === 601 || code === 603)) {
                    self.refresh($('<span>'+ data +'</span>'));
                    return;
                }
                // format error
                if(code && (code === 602)) {
                    for( var i=0; i<data.length; i++ ) stTable.append($('<tr><td>' + data[i] + '</td></tr>'));
                    self.refresh(stTable);
                    return;
                }
                // 服务器端解析错误
                if(code && code !== 200) {
                    self.refresh($('<span>解析错误</span>'));
                    return;
                }
                self.refresh($('<span>未知异常</span>'));
                deferred.reject(resp);
            });

        return deferred.promise();
    },

    refresh: function($Obj) {
        this.container.empty().append($Obj);
    },

    html: function() {
        var self = this;
        var trs = [];
        for(var i=0; i<self.stacklist.length; i++) {
            var stack = self.stacklist[i];
            var stackHtml = stack.html;
            var tr = '<tr><td>' + stackHtml + '</td></tr>';
            trs.push(tr);
        }
        return [ '<table class="et-detail-stackTrace-container">', trs.join(''), '</table>'].join('');
    },

    format: function(oriStacklist) {
        var self = this;
        var stacklist = [];
        for(var i=0; i<oriStacklist.length; i++) {
            var oriStack = oriStacklist[i];
            var stack = new Stack(oriStack);
            stacklist.push(stack);
        }
        return stacklist;
    },

    set: function(params) {
        this.appName = params.appName;
        this.errorId = params.errorId;
        if(!params.silence) this.init();
    }
}

module.exports = Stacklist
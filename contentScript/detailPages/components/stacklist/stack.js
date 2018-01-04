var Stack = function(options) {
    this.name = this.defaulter(options.name);
    this.file = this.defaulter(options.file);
    this.line = this.defaulter(options.line);
    this.column = this.defaulter(options.column);
    this.notStandard = !!options.notFormatStack;
    this.metaData = this.extractInfo();
    this.html = this.toHtml();
}
Stack.prototype = {

    projectGroup: {
        'tms-recruit': 'tms-ui', // 招聘
        'tita-web-v4': 'tita-ui', // tita
        'tms-bti': 'bi-ui', // 数据分析
        'tms-bi': 'tms-ui', // 数据分析
        'tms-setreport': 'bi-ui', // 数据分析
        'objective-management': 'italent-ui', // 目标管理
        'tms-performance': 'tms-ui', // 绩效员工前台
        'succession-admin': 'tms-ui',
        'setting-cloud-italent': 'platform-ui' // 实施态
    },

    singleMatches: {

    },

    disableLinks: [
        /vendor\/components/,   // 组件
        /beisen\-common\/talent\/all\-in\-one/,
        /scripts\/templates/, // 模板文件
        /app\/extras/
    ],

    extractInfo: function() {
        // "http://stnew03.beisen.com/ux/tms-recruit/hotfix/network/index-1608261853"
        // "http://stnew03.beisen.com/ux/tms-recruit/release/app/scripts/vendor/components/backbone/index.js"
        if(this.notStandard) return {};

        var expGroups = null;
        var fileText = this.file.text;

        var exp = fileText.match(/\/ux\/([\S]+?)\/[\S\s]+?(app\/(?:scripts|extras))\/([\S\s]+?)$/);
        if(exp){
            expGroups = [ exp[1], 'app/scripts/' + exp[3] ];
        }else {
            expGroups = [ '', '' ];
        }

        return {
            'appName': expGroups[0],
            'moduleName': expGroups[1]
        }
    },

    toHtml: function() {
        var html = []
        if(this.notStandard) {
            html.push(this.name.text);
        } else {
            html = [
                this.makeWrap(this.name), ' @(',
                this.makeWrap(this.file), '):',
                this.makeWrap(this.line), ':',
                this.makeWrap(this.column),
                this.makeNormalBtn(),
                this.makeBlamBtn()
            ];
        }
        return html.join('')
    },

    defaulter: function(attr) {
        attr = attr || {};
        return $.extend({
            'status': 'unCompress',
            'text': ''
        }, attr);
    },

    makeWrap: function(attr) {
        var color = (attr.status === 'compress')? '#b76868': '#676a6c';
        var tag = '<span style="color:'+ color +'">'+ attr.text +'</span>';
        return tag
    },

    getGitlabUrl: function(sign) {
        sign = sign || 'blob';
        var appName = this.metaData.appName;
        var moduleName = this.metaData.moduleName;
        for(var i=0; i<this.disableLinks.length; i++) {
            if(this.file.text.match(this.disableLinks[i])) {
                return {
                    'status': false,
                    'link': 'javascript:void(0)'
                };
            }
        }
        var gitlabUrl = [ 'http://../', this.projectGroup[appName], '/', appName, '/', sign, '/hotfix/', moduleName ].join('');
        for(var key in this.singleMatches) {
            if((this.file.text || '').match(key)) {
                gitlabUrl = this.singleMatches[key];
                break;
            }
        }
        return {
            'status': true,
            'link': gitlabUrl
        };
    },

    makeNormalBtn: function() {
        var self = this;
        var gitlabUrl = self.getGitlabUrl('blob');
        var className = '';
        if(gitlabUrl.status) {
            gitlabUrl.link += '#L' + this.line.text;
        } else {
            className = 'disabled';
        }
        var blamBtn = '<a class="btn btn-primary btn-xs stack-frame-a '+ className +'" href="'+ gitlabUrl.link + '" target="_blank">normal</a>';
        return blamBtn;
    },

    makeBlamBtn: function() {
        var self = this;
        var gitlabUrl = self.getGitlabUrl('blame');
        var className = '';
        if(gitlabUrl.status) {
            gitlabUrl.link += [ '#L', this.line.text, '&FN:', this.name.text ].join('');
        } else {
            className = 'disabled';
        }
        var normalBtn = '<a class="btn btn-primary btn-xs stack-frame-a '+ className +'" href="'+ gitlabUrl.link + '" target="_blank">blame</a>';
        return normalBtn;
    }
};

module.exports = Stack
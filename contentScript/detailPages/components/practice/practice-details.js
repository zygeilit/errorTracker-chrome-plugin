var SwitchInput = require('./practice-switchInput')
var Field = require('./../field')

var PracticeDetails = function(options) {
    this.className = 'et-practice-details';
    this.$el = $([
        '<div class="'+ this.className +'"></div>'
    ].join(''));
    this.model = this.defaulter(options.model||{});
    this.lines = [];
    this.init();
    this.bindEvents();
};

PracticeDetails.prototype = {

    init: function() {
        var self = this;

        for(var key in this.model) {
            var val = this.model[key];
            if(key === 'updateDate' || key === 'code' || key === 'author' || key === 'practiceId') continue;

            if($.trim(Field.Username().text()) !== '张跃') {
                if(key === 'keyWordsList') continue;
            }

            if(key === 'keyWordsList') val = JSON.stringify(val);

            var switchInput = new SwitchInput({
                model: { field: key, value: val },
                // 当 textarea 失去焦点的时候 更新所有数据
                callback_textareaBlur: function() {
                    self.update()
                }
            });

            if(key === 'keyWordsList') key = '关键字';
            if(key === 'solution') key = '解决方案';
            if(key === 'describe') key = '描述';
            var p = $('<p><span class="et-pd-label">'+ key +':</span><span class="et-pd-text-container"></span></p>');

            p.find('.et-pd-text-container').append(switchInput.$el);
            this.lines.push(p);
        }
        this.$el.append(this.lines);
    },

    bindEvents: function() {
        // 阻止事件冒泡
        this.$el.bind('click', function(e){
            e.stopImmediatePropagation();
            e.stopPropagation();
        })
    },

    update: function() {
        var self = this;

        var keyWordsList = JSON.stringify(this.model['keyWordsList']);

        if($.trim(Field.Username().text()) === '张跃') {
            keyWordsList = this.$el.find('.et-si-keyWordsList').text()
        }

        var data = {
            'practiceId': this.model.practiceId,
            'describe': this.$el.find('.et-si-describe').text(),
            'keyWordsList': keyWordsList, //JSON.stringify(this.model['keyWordsList']), // this.$el.find('.et-si-keyWordsList').text(),
            'solution': this.$el.find('.et-si-solution').text(),
            'eg': window.location.href
        };

        $.ajax({
            url: 'http://../update',
            type: 'POST',
            data: data,
            success: function(resp){
                if(!resp || resp.code !== 200) {
                    console.error('update error. [code]');
                    return false;
                }
            },
            error: function(){ console.error('update error') }
        })
    },

    defaulter: function(opt) {
        return $.extend({
            'author': '',
            'keyWordsList': '',
            'updateDate': '',
            'describe': '',
            'solution': '',
            'code': ''
        }, opt)
    },
}

module.exports = PracticeDetails
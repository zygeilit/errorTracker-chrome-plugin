var Field = require('./../field')
var KeyWordPicker = require('./picker/picker');

var PracticeNew = function(options) {
    this.$el = $([ 
        '<div class="et-practice-new">',
            '<div class="et-practice-new-title">添加最佳实践</div>',
            '<div class="et-practice-new-content">',
                //<textarea placeholder="关键词请以英文逗号分隔,请填写具有代表性的关键词"></textarea>
                '<p><span class="et-pnno-label">关键词:</span><span class="et-pnno-value keyWordList"></span></p>',
                '<p><span class="et-pnno-label">描述:</span><span class="et-pnno-value describe"><textarea placeholder="造成异常可能性原因"></textarea></span></p>',
                '<p><span class="et-pnno-label">解决方案:</span><span class="et-pnno-value solution"><textarea placeholder="方案描述,代码,建议等"></textarea></span></p>',
            '</div>',
            '<div class="et-practice-new-operator">',
                '<span class="et-pnno-tip"></span>',
                '<span class="et-pnno-save">save</span>',
                // '<span class="et-pnno-cancel">cancel</span>',
            '</div>',
        '</div>' 
    ].join(''));
    this.ui = {
        'content': this.$el.find('.et-practice-new-content'),
        'save': this.$el.find('.et-pnno-save'),
        'cancel': this.$el.find('.et-pnno-cancel'),
        'solution': this.$el.find('.solution textarea'),
        'describe': this.$el.find('.describe textarea'),
        'keyWordList': this.$el.find('.keyWordList'),
        'resultTip': this.$el.find('.et-pnno-tip')
    }
    this.init();
    this.bindEvents();
};

PracticeNew.prototype = {
    
    init: function() {

        this.keyWordPicker = new KeyWordPicker();
        this.ui.keyWordList.append(this.keyWordPicker.$el);
    },
    
    bindEvents: function() {
        var self = this;

        this.ui.save.bind('click', function() {

            var keyWordList = self.keyWordPicker.getData();
            if(!keyWordList || !keyWordList.length) return;

            var data = {
                'keyWordsList': JSON.stringify(keyWordList),
                'describe': self.ui.describe.val(),
                'solution': self.ui.solution.val(),
                'author': $.trim(Field.Username().text() || ''),
                'eg': window.location.href
            }
            
            $.ajax({
                url: 'http://../insert',
                type: 'POST',
                data: data,
                success: function(resp) {
                    
                    if(resp.code === 200) {
                        
                        self.ui.resultTip.html('添加成功');
                        self.ui.resultTip.addClass('success');
                        setTimeout(function(){ 
                            self.ui.resultTip.html('');
                            self.ui.resultTip.removeClass('success');
                        }, 1500);
                    
                        self.ui.keyWordList.val('')
                        self.ui.describe.val('')
                        self.ui.solution.val('')
                    } else {

                        self.ui.resultTip.html('添加失败');
                        self.ui.resultTip.addClass('failed');
                        setTimeout(function(){ 
                            self.ui.resultTip.html('');
                            self.ui.resultTip.removeClass('failed');
                        }, 1500);
                    }
                },
                error: function() { console.error('insert practice error.') }
            });
        });
        // this.ui.cancel.bind('click', function() {})
    }
};

module.exports = PracticeNew;
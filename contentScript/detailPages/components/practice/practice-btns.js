var PracticeTables = require('./practice-table')
var Field = require('./../field')
var Store = require('./../store')
var PracticeNew = require('./practice-new')

var PracticeBtns = function(options) {
    this.className = 'et-practice-btns';
    this.$el = $([
        '<div class="'+ this.className +'">',
            '<div>',
                '<span class="'+ this.className +'-bestPractice"><span style="display: inline-block">最佳实践</span><span class="et-bp-count"></span></span>',
                '<span class="'+ this.className +'-add">+</span>',
            '</div>',
            '<div class="'+ this.className +'-worktable"></div>',
        '</div>'
    ].join(''));
    this.ui = {
        'bestPractice': this.$el.find('.' + this.className + '-bestPractice'),
        'worktable': this.$el.find('.' + this.className + '-worktable'),
        'add': this.$el.find('.' + this.className + '-add')
    };
    this.options = options;
    this.init();
    this.practices = null;
};

PracticeBtns.prototype = {

    init: function() {
        var self = this;

        this.bindEvents();
        this.load().done(function(practices){
            self.practices = practices;
            var len = practices.length;
            self.ui.bestPractice.find('.et-bp-count').html(len);
        })
    },

    load: function() {
        var self = this;

        var def = $.Deferred();

        var excInfo = {
            'ExceptionFullName': Field.ExceptionFullName().text(),
            'Message': Store.get('ori_message'),
            'StackTrace': Store.get('ori_stacklist'),
            'Browser': Field.Browser().text(),
            'Username': Field.Username().text(),
            'UserAgent': Field.UserAgent().text(),
            'CatchClassName': Field.CatchClassName().text(),
            'AppName': Field.AppName().text()
        };

        // console.dir(excInfo)

        // 格式化参数
        for(var key in excInfo) excInfo[key] = $.trim(excInfo[key]);

        console.dir(excInfo)

        $.ajax({
            url: "http://../getPractices",
            type: "POST",
            data: {
                'exceptionInfo': JSON.stringify(excInfo)
            },
            success: function(resp) {
                var practices = resp.data;
                def.resolve(practices);
            }
            ,error: function(){
                console.error('getPractices error');
                def.reject();
            }
        });

        return def.promise();
    },

    bindEvents: function() {
        var self = this;

        self.ui.bestPractice.bind('click', function(){
            var $this = $(this);

            self.ui.add.data('isOnShowing') && self.ui.add.click();

            // 打开状态
            if($this.data('isOnShowing')) {
                self.ui.worktable.empty();
                $this.data('isOnShowing', false);
                self.ui.bestPractice.removeClass('active');
                return;
            }

            if(!self.practices || !self.practices.length) {
                // 没有找到对应的最佳实践
                var d = $('<div class="et-has-no-practice">暂无最佳实践</div>')
                self.ui.worktable.append(d);
                $this.data('isOnShowing', true);
                self.ui.bestPractice.addClass('active');
                return;
            }

            var pTable = new PracticeTables({ collection: self.practices });
            self.ui.worktable.append(pTable.$el);

            $this.data('isOnShowing', true);
            self.ui.bestPractice.addClass('active');
        });

        self.ui.add.bind('click', function(){
            var $this = $(this);

            self.ui.bestPractice.data('isOnShowing') && self.ui.bestPractice.click();

            if($this.data('isOnShowing')) {
                self.ui.worktable.empty();
                $this.data('isOnShowing', false);
                self.ui.add.removeClass('active');
                return;
            }
            
            var pDetails = new PracticeNew();
            self.ui.worktable.append(pDetails.$el);

            $this.data('isOnShowing', true);
            self.ui.add.addClass('active');
        });
    },

}

module.exports = PracticeBtns
var Field = require('./../field');
var PracticeDetails = require('./practice-details');

var Practice = function(options) {
    this.className = 'et-practice';
    this.$el = $('<div class="'+ this.className +'"></div>');
    this.model = this.defaulter(options.model);
    this.domAttrs = [];
    this.details = null;
    this.detailsContainer = null;
    this.init();
};

Practice.prototype = {

    init: function() {
        this.bindEvents();

        var attrs = [ 'author', 'describe', 'updateDate' ];

        for(var i=0; i<attrs.length; i++) {

            var val = this.model[attrs[i]];

            var td = $('<span class="et-practice-attr epa-' + attrs[i] + '">' + val + '</span>');
            this.domAttrs.push(td);
        }
        this.$el.append(this.domAttrs);
    },

    defaulter: function(opt) {
        return $.extend({
            'author': '',
            'keyWordsList': [],
            'updateDate': null,
            'describe': '',
            'solution': '',
            'code': ''
        }, opt)
    },

    bindEvents: function() {
        var self = this;
        self.$el.bind('click', function(){
            self.clickHandler();
        });
    },
    
    showDetails: function() {
        var self = this;
        this.details = new PracticeDetails({ model: this.model });
        this.detailsContainer = $('<div class="et-practice-details-container"></div>');
        this.detailsContainer.append(this.details.$el);
        this.$el.append(this.detailsContainer);
    },

    clickHandler: function() {
        var self = this;
        var excTypeDom = Field.ExceptionFullName();

        // 关闭的状态
        if(!this.isDetailting) {
            self.showDetails();
            // 高亮
            var excHtml = excTypeDom.attr('data-oriHtml');
            for(var i=0; i<self.model.keyWordsList.length; i++) {
                var keyWord = self.model.keyWordsList[i];
                var cArr = excHtml.split(keyWord);
                excHtml = cArr.join('<span class="et-highlight">'+ keyWord +'</span>');
            }
            excTypeDom.html(excHtml);
        }
        // 已经是打开的状态
        else {
            this.details.$el.remove();
            this.details = null;
            this.detailsContainer.remove();
            this.detailsContainer = null;
            //还原
            var oriHtml = excTypeDom.attr('data-oriHtml');
            excTypeDom.html(oriHtml)
        }
        this.isDetailting = !!!this.isDetailting;
    }

}

module.exports = Practice
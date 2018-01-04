var KeyWord = require('./key-word')
var Field = require('./../../field')

var Picker = function(options) {
    this.$el =$([
        '<div class="et-picker">',
            '<span class="et-picker-input-container">',
                '<select class="et-pi-fieldSelector"></select>',
                '<span style="margin-left: 3px; margin-right: 6px;display: inline-block;"></span>',
                '<input type="text" class="et-pi-input">',
            '</span>',
            '<span class="et-picker-add">add</span>',
            '<div class="et-picker-content"></div>',
        '</div>'
    ].join(''));
    this.options = options || {};
    this.event = null;
    this.children = {};
    this.ui = {
        'add': this.$el.find('.et-picker-add'),
        'content': this.$el.find('.et-picker-content'),
        'selector': this.$el.find('.et-pi-fieldSelector'),
        'textInput': this.$el.find('.et-pi-input'),
    }
    this.init();
    this.bindEvents();
};

Picker.prototype = {

    init: function() {
        var self = this;
        
        this.fillFeildToSelector();
        this.event = new window['ET_Events']({ name: 'et-picker' });
        // 删除子节点
        this.event.listenTo('keyWordRemove', function(opt) {
            self.children[opt.id] = null;
            delete self.children[opt.id];
        });
    },

    fillFeildToSelector: function() {
        var fieldList = [ 'ExceptionFullName', 'Message', 'StackTrace', 'CatchClassName', 'UserAgent', 'Browser', 'Username', 'AppName' ];
        for(var i=0; i<fieldList.length; i++) {
            var field = fieldList[i];
            var $option = $('<option value="'+ field +'">'+ field +'</option>');
            this.ui.selector.append($option);
        }
    },

    getData: function() {
        var data = [];
        for(var key in this.children) {
            var child = this.children[key];
            data.push(child.model);
        }
        return data;
    },

    setData: function(dataList) {
        this.children = [];
        this.ui.content.empty();
        for(var i=0; i<dataList.length; i++) {
            var data = dataList[i];
            this.createKeyWord(data.field, data.text);
        }
    },

    createKeyWord: function(field, text) {
        var self = this;

        var keyWord = new KeyWord({
            model: {
                field: field,
                text: text
            },
            event: self.event,
            id: ((new Date()).getTime() + '')
        });

        self.children[ keyWord.id ] = keyWord;
        self.ui.content.append(keyWord.$el);
    },

    bindEvents: function() {
        var self = this;
        
        this.ui.add.bind('click', function() {
            var text = self.ui.textInput.val();
            if(!text) return;
            var field = self.ui.selector.val();
            self.ui.textInput.val('');
            self.createKeyWord(field, text);
        });
    }
};

module.exports = Picker;
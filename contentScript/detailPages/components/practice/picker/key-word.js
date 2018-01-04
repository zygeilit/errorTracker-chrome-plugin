
var KeyWord = function(options) {
    this.$el =$([
        '<div class="et-key-word">',
            '<span class="et-kw-field"></span>',
            '<span class="et-kw-split">:</span>',
            '<span class="et-kw-text"></span>',
            '<span class="et-kw-operator">',
                '<span class="et-kwo-remove">X</span>',
            '</span>',
        '</div>'
    ].join(''));
    this.options = options;
    this.model = options.model;
    this.event = options['event'];
    this.id = options.id;
    this.ui = {
        'field': this.$el.find('.et-kw-field'),
        'text': this.$el.find('.et-kw-text'),
        'remove': this.$el.find('.et-kwo-remove')
    }
    this.init();
    this.bindEvents();
};

KeyWord.prototype = {

    init: function() {
        this.ui.field.html(this.model.field);
        this.ui.text.html(this.model.text);
        var className = 'etk-' + (this.model.field || '').toLowerCase();
        this.$el.addClass(className)
    },

    bindEvents: function() {
        var self = this;
        this.ui.remove.bind('click', function() {
            self.$el.remove();
            self.event.dispatch('keyWordRemove', { 
                'field': self.model.field,
                'text': self.model.text,
                'id': self.id,
            });
        })
    }
};

module.exports = KeyWord;
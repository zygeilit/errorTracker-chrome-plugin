
var SwitchInput = function(options) {
    this.className = 'et-switch-input';
    this.$el = $('<span class="'+ this.className +'"></span>');
    this.model = options.model;
    var classNameInput = 'et-si-'+ this.model.field;
    this.inputTextArea = $('<textarea class="et-textarea '+ classNameInput +'"></textarea>');
    this.inputSpan = $('<span class="et-input '+ classNameInput +'"></span>');
    this.callback_textareaBlur = options['callback_textareaBlur'] || function() {};
    this.init();
}

SwitchInput.prototype = {

    init: function() {
        this.switchInput('span');
    },

    switchInput: function(flag) {
        var self = this;
        this.$el.empty();
        if(flag === 'textArea') {
            this.inputTextArea.bind('blur', function(){
                self.model['value'] = self.inputTextArea.val();
                self.switchInput('span');
                self.callback_textareaBlur(this);
            });
            this.inputTextArea.text(this.model.value);
            this.$el.append(this.inputTextArea);
            this.inputTextArea.focus();
        } else {
            this.inputSpan.bind('click', function(){
                if(self.model.field === 'author') return;
                self.switchInput('textArea');
            });
            this.inputSpan.text(this.model.value);
            this.$el.append(this.inputSpan);
        }
    }
}

module.exports = SwitchInput

var Tip = (function() {

    var Tip = function(options) {
        this.$el = $('<span class="et-tools-tip"><span class="ett-count"></span></span>');
        this.textContainer = $('<ul class="ett-container"></ul>');
        this.collection = options.collection;
        this.attachTarget = options['target'];
    }
    
    Tip.prototype = {

        init: function() {
            var self = this;

            self.attachTarget.append(this.$el);

            for(var i=0; i<this.collection.length; i++) {
                var pText = this.collection[i];
                var li = $('<li><span>'+( i+1 )+'.</span><span class="ettc-text">'+ pText +'</span></li>');
                this.textContainer.append(li);
            }
            
            this.$el.find('.ett-count').text(this.collection.length);

            this.$el.bind('mouseover', function(){
                self.textContainer.show();
                self.textContainer.appendTo(self.$el);
            }).bind('mouseleave', function(){
                self.textContainer.hide();
            })
        }
    };

    return Tip
})()

module.exports = Tip
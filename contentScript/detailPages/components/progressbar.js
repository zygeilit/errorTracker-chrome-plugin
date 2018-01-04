var ProcessBar = function(options) {
    this.store = {};
    this.$el = $('<span class="process-bar"><span class="process-bar-sub"></span></span>');
    options.container.append(this.$el);
};

ProcessBar.prototype = {

    getElement: function(cssSelector) {
        if(this.store[cssSelector]) return this.store[cssSelector];
        this.store[cssSelector] = this.$el.find(cssSelector);
        return this.store[cssSelector];
    },

    load: function(){
        var self = this;
        var currentWidth = 0;
        (function _self_animation(_t) {
            window.requestAnimationFrame(function() {
                var subTag = self.getElement(".process-bar-sub");
                currentWidth = currentWidth + 1;
                if(currentWidth > 100) return;
                subTag.css('width', currentWidth+'%');
                window.setTimeout(_self_animation, _t);
            })
        })(1500);
    }
};

module.exports = ProcessBar
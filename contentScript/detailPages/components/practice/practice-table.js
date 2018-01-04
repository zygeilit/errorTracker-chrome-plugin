var Practice = require('./practice')

var PracticeTable = function(options) {
    this.$el = $([
        '<div class="et-practice-table"><span class="et-practice-table-title">最佳实践</span></div>'
    ].join(''));
    this.collection = options.collection || [];
    this.children = [];
    this.init();
};

PracticeTable.prototype = {

    init: function() {
        var self = this;
        var doms = [];
        for(var i=0; i<self.collection.length; i++) {
            var child = new Practice({ model: self.collection[i] });
            self.children.push(child);
            doms.push(child.$el);
        }
        this.$el.append(doms);
    }
}

module.exports = PracticeTable
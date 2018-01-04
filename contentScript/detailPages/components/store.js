
var ETSTORE = (function(){
    var self = this;
    this.store = {};
    return {
        set: function(key, obj) {
            self.store[key] = obj;
        },
        get: function(key) {
            return self.store[key];
        }
    }
})()

module.exports = ETSTORE
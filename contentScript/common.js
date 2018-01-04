(function EventClass() {

    var event_store = {};

    window['ET_Events'] = function _Events(options) {
        this._id;
        this.listenStore = {};
        this.name = options['name'];
        event_store[this.name] = this;
    };

    window['ET_Events'].prototype = {

        init: function() {
            this._id = (new Date()).getTime();
        },

        listenTo: function(key, operator) {
            if(!this.listenStore[key]) this.listenStore[key] = [];
            this.listenStore[key].push(operator);
        },

        dispatch: function(key, args) {
            if(!this.listenStore[key]) return;
            for(var i=0; i<this.listenStore[key].length; i++) {
                var operator = this.listenStore[key][i];
                operator.apply(this, [ args ]);
            }
        },

        die: function() {
           event_store[this.name] = null;
        }
    };
})();
import Vue from 'nativescript-vue'

export const EventBus = new Vue({
    data(){ return {
        listeners: {},
    } },
    methods: {
        on(event,module,listener){
            if(!this.listeners.hasOwnProperty(event)) { this.createEvent(event); return this.on(event,module,listener); }
            if(!this.listeners[event].hasOwnProperty(module)) { this.createEventModule(event,module); return this.on(event,module,listener); }

            if(this.listeners[event][module] !== null) this.off(event,module,listener);
            this.createListener(event,module,listener);
        },

        createEvent(event){ this.$set(this.listeners,event,{}); },
        createEventModule(event,module){ this.$set(this.listeners[event],module,null); },

        createListener(event,module,listener){
            this.$on(event,listener);
            this.listeners[event][module] = true;
        },

        off(event,module,listener){
            let lbo = this._events[event] ? this._events[event].length : 0, lao; this.$off(event,listener); lao = this._events[event] ? this._events[event].length : 0;
            if(lbo === lao || lao === 0) this.$off(event);
            if(_.get(this.listeners,[event,module],null) !== null) this.listeners[event][module] = null;
        }
    }
});
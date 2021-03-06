export const EventListeners = {
    data(){ return {
        events: [],
    } },
    methods: {
        ELOn(event,listener){ EB.on(event,this.$options.name,listener) },
        ELOff(event,listener){ EB.off(event,this.$options.name,listener) },
        ELEmit(event,data){ EB.$emit(event,data) },
        ELCreate(){ this.events.map((event,idx) => { this.ELOn(event,this['listener'+idx]); }) }
    },
    created(){ this.ELCreate() },
    beforeDestroy() {
        if(this.$options.name === 'App') return;
        this.events.map((event,idx) => { this.ELOff(event,this['listener'+idx]); });
    },
};

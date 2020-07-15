import Vue from 'vue'
export const ThisObj = {
    methods: {
        TO_Get(props,lookup,arg){
            let propsArray = Array.isArray(props) ? props : [props], vm = this;
            return _.zipObject(propsArray,_.map(propsArray,prop => vm.TO_GetPropertyValue(prop,lookup,arg)));
        },
        TO_GetPropertyValue(prop,lookup,arg){
            if(!lookup) return this.TO_GetFromThis(prop,arg);
            if(lookup[prop] && _.hasIn(this,lookup[prop])) return this.TO_GetFromThis(lookup[prop],arg);
            if(_.has(lookup,prop)) return _.get(lookup,prop,null);
            return this.TO_GetFromThis(prop,arg);
        },
        TO_GetFromThis(Prop,arg){
            return (typeof this[Prop] === 'function') ? this[Prop](arg) : _.get(this,Prop,null)
        },
        TO_SetPropFromObj(Obj){
            let vm = this;
            _.forEach(Obj,(value,key) => Vue.set(vm,key,value));
        }
    }
};

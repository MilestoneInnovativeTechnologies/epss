import {EventListeners} from "./eventlisteners";
import { common,text } from "./formelement";

export const AppListDetailUpdate = {
    props: ['idx','updates','path'],
    mixins: [EventListeners,common,text],
    data(){ return {
        ALDU_linkClasses: ['text-underline'],
    } },
    methods: {
        ALDU_content(){ return this.$slots.default[0].text },
        ALDU_is(path){ return _.includes(this.updates,path) },
        ALDU_class(path){ return this.ALDU_is(path) ? this.ALDU_linkClasses : [] },
        ALDU_do(){
            this.ELEmit('absolute-form',{ fields: this.appFormFields({ value:'Text' }),values: { value: this.ALDU_content() },action:'Update',title:'Set new value' });
            this.ELOn('absolute-form-submit',({ value }) => { this.ALDU_update(value); this.ELOff('absolute-form-submit'); this.ELEmit('absolute-form-close'); });
        },
        ALDU_update(value){
            let data = _.zipObject([this.path],[value]), index = _.toSafeInteger(this.idx);
            this.ELEmit('applist-dataitem-update',{ index,data });
        }
    }
};
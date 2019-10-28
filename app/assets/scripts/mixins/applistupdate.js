import {EventListeners} from "./eventlisteners";
import {AppListUpdate} from "./../services/AppListUpdate";

export const AppListDetailUpdate = {
    props: ['text','idx','update','path'],
    mixins: [EventListeners],
    data(){ return {
        ALDU_linkClasses: ['text-underline'],
    } },
    methods: {
        ALDU_is(){ return !!this.update },
        ALDU_do(){
            let absFormData = new AppListUpdate().value(this.update,this.text);
            this.ELEmit('absolute-form',absFormData);
            this.ELOn('absolute-form-submit',({ value }) => { this.ALDU_update(value); this.ELOff('absolute-form-submit'); this.ELEmit('absolute-form-close'); });
        },
        ALDU_update(value){
            let data = _.zipObject([this.path],[value]), index = _.toSafeInteger(this.idx);
            this.ELEmit('applist-dataitem-update',{ index,data });
        },
    }
};
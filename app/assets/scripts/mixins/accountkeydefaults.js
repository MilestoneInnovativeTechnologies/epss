import {mapMutations, mapState} from 'vuex';
import {set_state_data} from "../vuex/mutation-types";
import {EventListeners} from "./eventlisteners";
const feMX = require('./../../../assets/scripts/mixins/formelement');

export const AccountKeyDefaults = {
    mixins: [EventListeners, feMX.common, feMX.fiscal, feMX.store],
    computed: mapState({ fycode:'default_fycode',store:'default_store' }),
    methods: {
        ...mapMutations([set_state_data]),
        ACCKDs_requestDefaults(){
            if(this.ACCKDs_canSetDefaults()) return EB.$emit('account-defaults-set');
            this.ELOn('absolute-form-submit',this.listener0);
            let absFormProps = { fields:this.appFormFields({ store:'Store', fycode:'Fiscal' }),action:'Update default details',title:'Set default details' };
            this.ELEmit('absolute-form',absFormProps);
        },
        ACCKDs_canSetDefaults(){
            if(this.feValuesFiscal.items.length === 1) this[set_state_data]({ default_fycode:this.feValuesFiscal.items[0][this.feValuesFiscal.key] });
            if(this.feValuesStore.items.length === 1) this[set_state_data]({ default_store:this.feValuesStore.items[0][this.feValuesStore.key] });
            return (this.fycode && this.store);
        },
        listener0(data){
            _.forEach(data,(value,field) => this[set_state_data](_.zipObject(['default_'+field],[value])));
            this.ELEmit('absolute-form-close'); this.ELEmit('account-defaults-set');
        }
    }
};
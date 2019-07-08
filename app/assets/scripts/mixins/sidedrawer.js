import { mapState,mapMutations } from "vuex";
import {set_state_data} from "../vuex/mutation-types";

export const RadSideDrawerControl = {
    computed: mapState('Menu',['drawerActiveStatus']),
    methods: {
        ...mapMutations('Menu',{ updateSideDrawerActiveStatus:set_state_data }),
        toggleRadSideDrawerDisplay(status){ if(this.$refs['drawer']) this.$refs['drawer'].nativeView[(status?'show':'close') + 'Drawer'](); },
        changeRadSideDrawerStatus(status){ this['updateSideDrawerActiveStatus']({ 'drawerActiveStatus':status }) }
    },
    created(){
        this['changeRadSideDrawerStatus'](false);
    },
    watch: {
        drawerActiveStatus(status){ this['toggleRadSideDrawerDisplay'](status) },
    }
};
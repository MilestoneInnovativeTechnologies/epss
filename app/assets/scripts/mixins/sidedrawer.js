import { mapState,mapMutations } from "vuex";
import {set_state_data} from "../vuex/mutation-types";

export const RadSideDrawerControl = {
    data(){ return {
        drawerContentSizePercent:80
    }},
    computed: {
        ...mapState('Menu',['drawerActiveStatus']),
        ...mapState('App',{ appDeviceWidth:'width' }),
        drawerContentSize(){ return parseInt(parseInt(this.appDeviceWidth)*(this.drawerContentSizePercent/100)) }
    },
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
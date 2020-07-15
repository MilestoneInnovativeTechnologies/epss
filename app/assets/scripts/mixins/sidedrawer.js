import { mapState,mapMutations } from "vuex";
import {set_state_data} from "../vuex/mutation-types";
import {drawer_content_size_max, drawer_content_size_min, drawer_content_size_percent} from "../constants";

export const RadSideDrawerControl = {
    computed: {
        ...mapState('Menu',['drawerActiveStatus']),
        ...mapState('App',{ appDeviceWidth:'width' }),
        drawerContentSize(){
            let width = parseInt(parseInt(this.appDeviceWidth)*(drawer_content_size_percent/100));
            return (width < drawer_content_size_max) ? ((width < drawer_content_size_min) ? drawer_content_size_min : width) : drawer_content_size_max
        }
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

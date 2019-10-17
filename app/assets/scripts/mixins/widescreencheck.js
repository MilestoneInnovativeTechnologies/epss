import {mapState} from "vuex";
import {wide_screen_minimum_width} from "../constants";

export const WideScreenCheck = {
    computed: {
        ...mapState('App',{ WSC_deviceWidth: 'width' }),
        WSC_isWide(){ let width = this.WSC_deviceWidth; return (wide_screen_minimum_width < _.toNumber(width)) }
    }
};
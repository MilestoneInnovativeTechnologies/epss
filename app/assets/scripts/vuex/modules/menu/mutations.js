import {add_setup_menu_data} from "../../mutation-types";

export default {
    [add_setup_menu_data](state, dataArray) {
        _.forEach(dataArray,sMenuData => state.sMenuData.push(sMenuData));
    },
};
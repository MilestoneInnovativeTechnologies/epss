import { connectionType,startMonitoring } from "tns-core-modules/connectivity";
import {set_connectivity_availability} from "../../mutation-types";


export function init({ commit,dispatch }) {
    startMonitoring((type) => {
        let status = type !== connectionType.none;
        commit(set_connectivity_availability,status);
        dispatch('triggerEventSubscribers',{ payload:status,event:'onConnectionChange' },{ root:true });
    });
}

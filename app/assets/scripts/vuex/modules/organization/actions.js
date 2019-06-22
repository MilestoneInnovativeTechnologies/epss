import { organization_fetch_url } from '../../../constants';
import {
    populate_organisation_data,
    populate_axios_url_data,
    set_sync_base_url,
    set_device_uuid
} from "../../mutation-types";

const device = require('tns-core-modules/platform').device;

export async function init({ dispatch,commit,state }) {
    //await DB.drop(state.table);
    log('Initializing Application');
    DB.get(state.table,null,function(dispatch,commit,uuid){
        if(this.error) { log('No Organization Table/Data Found'); return dispatch('setupApp',uuid); }
        dispatch('populateOrganizationData',{ data:this.result, uuid });
    },dispatch,commit,device.uuid);
}

export function populateOrganizationData({ commit,dispatch,rootGetters }, { data,uuid }) {
    commit(set_device_uuid,uuid);
    commit(populate_organisation_data,data);
    commit('Axios/' + populate_axios_url_data,{ data,uuid },{ root:true });
    commit('Sync/' + set_sync_base_url,{ data,uuid },{ root:true });
}

export function setupApp({ dispatch,commit },uuid) {
    commit(set_device_uuid,uuid);
    log('Initializing Setup');
    dispatch('setupOrganization');
}
export function setupOrganization({ dispatch }){
    log('Setting up Organization');
    let url = organization_fetch_url, params = { uuid:device.uuid }, success = 'Organization/setup';
    log('Requesting device registrations');
    dispatch('get',{ url,params,success },{ root: true });
}

export function setup({ dispatch },data) {
    return _.isEmpty(data) ? log('Device not registered: ' + device.uuid) : dispatch('setupOrganizationDatabase',data);
}

export function setupOrganizationDatabase({ state,commit,dispatch },data) {
    DB.create(state.table,'name,detail',function(data,table,dispatch,uuid){
        let ignoreKeys = ['id','created_at','updated_at'];
        DB.insert(table,toRowData(_.omit(data,ignoreKeys)),function(dispatch,uuid){
            DB.get(table,null,function(dispatch,uuid){
                log('Populating organization data'); dispatch('populateOrganizationData',{ data:this.result,uuid });
                log('Deleting client from server'); dispatch('Sync/deleteClient',null,{ root:true });
                log('Initializing Database setup'); dispatch('Database/Setup',null,{ root:true });
            },dispatch,uuid);
        },dispatch,uuid)
    },data,state.table,dispatch,state.uuid)
}

function toRowData(obj){
    return _.map(obj,(val,key) => { return _.zipObject(['name','detail'],[key,val]); })
}
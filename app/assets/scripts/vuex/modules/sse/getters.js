import {sse_monitor_path} from "../../../constants";

export function SSEUrl(state,getters,rootState,rootGetter){ let appRG = rootGetter['App/get']; return appRG('url_interact') ? [appRG('url_interact'),sse_monitor_path,appRG('uuid')].join('/') : null; }
export function SYNCTables(state,getters,rootState){ return Object.keys(rootState['Sync'].tables); }
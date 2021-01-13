export function setting(state,{ _tableDataByField }) {
    let S1 = _tableDataByField('settings','name'), S2 = _tableDataByField('user_settings','setting');
    return (name) => {
        let SettingID = _.get(S1,[name,'id'],null);
        return _.has(S2,SettingID) ? _.get(S2,[SettingID,'value']) : _.get(S1,[name,'value']);
    }
}
export function all(state,{ _tableDataByField,_tableDataByKeyField }) {
    let S1 = _tableDataByField('settings','name'), S2 = _tableDataByKeyField('user_settings','setting','value');
    return _.mapValues(S1,({ value,id },name) => _.get(S2,id,value))
}

export function setting(state,{ _tableDataByField }) {
    let S1 = _tableDataByField('settings','name'), S2 = _tableDataByField('user_settings','setting');
    return (name) => {
        let SettingID = _.get(S1,[name,'id'],null);
        return _.has(S2,SettingID) ? _.get(S2,[SettingID,'value']) : _.get(S1,[name,'value']);
    }
}

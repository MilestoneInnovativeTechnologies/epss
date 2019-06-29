export function setting(state,{ _tableDataByField }) {
    return (name) => {
        let data = _.get(_tableDataByField('settings','name'),name);
        let settingId = data.id, userSetting = _.get(_tableDataByField('user_settings','setting'),settingId);
        return _.isEmpty(userSetting) ? _.get(data,'value') : _.get(userSetting,'value');
    }
}

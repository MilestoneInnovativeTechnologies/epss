export const FormElementMixinCommon = {
    methods: {
        formFieldsToFields(fields) {
            fields = fields || this.formFields;
            return (_.isEmpty(fields)) ? {} : _.mapValues(fields, (mxn, name) => {
                return {...(this['feField' + mxn]), name}
            })
        },
        formDataToTables(formData) {
            if (!this.formBinds || _.isEmpty(this.formBinds)) return;
            _.forEach(this.formBinds, (bindObj, table) => {
                if (!bindObj || !bindObj.method || !bindObj.fields) return;
                let success = bindObj.success, method = bindObj.method,
                    data = _.isArray(bindObj.fields) ? _.pick(formData, bindObj.fields) :
                    _.mapValues(bindObj.fields, (fField) => _.get(formData, fField));
                this[method]({table, data, success: this[success], vm: this})
            })
        }
    }
};
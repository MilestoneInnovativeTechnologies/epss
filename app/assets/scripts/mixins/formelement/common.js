export const FormElementMixinCommon = {
    methods: {
        formFieldsToFields() {
            return (_.isEmpty(this.formFields)) ? {} : _.mapValues(this.formFields, (mxn, name) => {
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
export const FormElementMixinCommon = {
    methods: {
        appFormFields(fields) {
            fields = fields || this.fieldLayout; let index = 0;
            return (_.isEmpty(fields)) ? {} : _.mapValues(fields, (mxn, name) => {
                return { ...(this['feField' + mxn]), name, index:(index++) }
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
        },
        defaultItemEmpty(array,key,label){
            let emptyStr = ' - ';
            array.unshift( (key && label) ? _.zipObject([key,label],['',emptyStr]) : emptyStr);
            return array;
        }
    }
};
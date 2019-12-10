const feMX = require('./formelement');
const mixins = _.map(feMX,(mixin) => mixin);
const applyMethods = ['clearLabel','removeAttrs','addValues','makeSwitch'];

export const SettingsCommonMixin = {
    mixins,
    computed: {
        fields(){ return this.purifyFields(this.appFormFields({ SettingValue:this.editor || 'Text' })) },
    },
    methods: {
        purifyFields(fieldsObj){ return _.mapValues(fieldsObj,obj => applyMethods.reduce((obj,method) => this[method](obj),obj)); },
        clearLabel(obj){ obj['label'] = ''; return obj; },
        removeAttrs(obj){ return _.omit(obj,['hidden']) },
        addValues(obj){ if(obj.type === 'Picker' && this.options) obj.values = this.options; return obj },
        makeSwitch(obj){ if(this.switch && (this.switch === true || this.switch === 'true')) { obj.type = 'Picker'; obj.values = 'No,Yes' } return obj },
    },
};
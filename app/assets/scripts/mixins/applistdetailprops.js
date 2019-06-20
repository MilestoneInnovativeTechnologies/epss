export const AppListDetailProps = {
    computed: {
        _propObject(){ return _.isEmpty(this.props) ? {} : this._getPropObjectOfNonEmpty(this.props) }
    },
    methods: {
        _getPropObjectOfNonEmpty(props){ return _.isString(props) ? _.zipObject([props],[props]) : this._getPropObjectOfNonString(props) },
        _getPropObjectOfNonString(props){ return _.isArray(props) ? this._getPropObjectOfArray(props) : props },
        _getPropObjectOfArray(props){ let vm = this; return _.reduce(_.filter(props),function(accum,prop){ return {...accum,...(vm._getPropObjectOfNonEmpty(prop))} },{}) },
        linkProps(item,propObj){ propObj = propObj || this._propObject; return _.mapValues(propObj,(itemKey) => _.get(item,itemKey)) },
    }
};
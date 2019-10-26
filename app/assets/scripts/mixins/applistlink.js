import {AppListDetailProps} from "./applistdetailprops";

export const AppListLinkNavigate = {
    mixins:[AppListDetailProps],
    props: ['links'],
    data(){ return {
        mixinLinkClasses: ['cp','text-underline'],
    } },
    methods: {
        _linkObj(path){ return _.get(this.links,path) },
        _linkHas(path){ return (!_.isEmpty(this.links) && !_.isEmpty(this._linkObj(path))) },
        _linkClass(path){ return this._linkHas(path) ? this.mixinLinkClasses : [] },
        _linkDetail(path){
            let linkObj = this._linkObj(path); if(!linkObj) return null;
            return _.isArray(linkObj) ? _.head(linkObj) : linkObj;
        },
        _linkProps(path){
            let linkObj = this._linkObj(path); if(!linkObj || !_.isArray(linkObj) || _.isEmpty(_.tail(linkObj))) return {};
            let propObj = this._getPropObjectOfNonEmpty(_.flattenDeep(_.tail(linkObj)));
            return this.linkProps(this.item,propObj)
        },
        _linkNavigate(path){
            if(!this._linkHas(path)) return;
            let comp = require('./../../../components/pages/' + (this._linkDetail(path)) + '.vue').default;
            let props = { props: this._linkProps(path) };
            this.$navigateTo(comp,props);
        },
    }
};
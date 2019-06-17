export const AppListLinkNavigate = {
    props: {
        links: { type:Object,default:{} },
    },
    data(){ return {
        linkClasses: ['cp','text-underline']
    } },
    methods: {
        linkObj(path){ return _.get(this.links,path) },
        hasLink(path){ return (!_.isEmpty(this.links) && !_.isEmpty(this.linkObj(path))) },
        linkClass(path){ return this.hasLink(path) ? this.linkClasses : [] },
        pathLink(path){
            let linkObj = this.linkObj(path); if(!linkObj) return null;
            return _.isArray(linkObj) ? _.head(linkObj) : linkObj;
        },
        pathProps(path){
            let linkObj = this.linkObj(path); if(!linkObj || !_.isArray(linkObj)) return {};
            return _.pick(this.item,_.tail(linkObj));
        },
        navigate(path){
            let pathLink = this.pathLink(path);
            if(!this.hasLink(path) || !pathLink || _.isEmpty(pathLink)) return;
            let comp = require('./../../../components/pages/' + this.pathLink(path) + '.vue').default;
            let props = { props: this.pathProps(path) };
            this.$navigateTo(comp,props);
        }
    }
};
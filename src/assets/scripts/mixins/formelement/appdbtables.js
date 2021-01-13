import { mapState } from "vuex";

export const FormElementMixinAppDBTables = {
    data(){ return {
        feDataAppDBTables: [],
    } },
    computed: {
        ...mapState('App',['dbTables','appTables']),
        feValuesAppDBTables(){ return['epss_tblinfo'].concat(this.dbTables,this.appTables,this.feDataAppDBTables).join(','); },
        feFieldAppDBTables(){ return { name:'tables',label:'Select DB Table',type:'Picker',values:this.feValuesAppDBTables } }
    },
    created() {
        DB.get('epss_tblinfo').then(records => this.feDataAppDBTables = _.map(records,'table'));
    }
};
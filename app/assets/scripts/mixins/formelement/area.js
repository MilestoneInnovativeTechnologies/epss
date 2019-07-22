import {mapActions, mapState} from "vuex";
import {user_assigned_store_areas} from "../../queries";

export const FormElementMixinArea = {
    computed: {
        ...mapState('Areas',{ feAreaList:'list' }),...mapState('User',{ feUserID:'id' }),
        feValuesArea(){
            let list = this.feAreaList, key = 'id', label = 'name', listArray = _.map(list,(area) => _.zipObject([key,label],[area[key],area[label]]));
            return { items:listArray, key, label };
        },
        feFieldArea(){ return { name:'area',label:'Area',type:'Picker',values:this.feValuesArea,hidden:(this.feValuesArea.items.length === 1) } },
    },
    methods: {
        ...mapActions({ feListFetchArea: 'Areas/_stockIfNot' }),
    },
    created() {
        this.feListFetchArea({ query:sql.format(user_assigned_store_areas,this.feUserID),key:'list' })
    }
};
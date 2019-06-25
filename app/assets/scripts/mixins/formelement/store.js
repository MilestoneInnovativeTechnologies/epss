import {mapActions, mapState} from "vuex";
import {user_assigned_stores} from "../../queries";

export const FormElementMixinStore = {
    computed: {
        ...mapState('Stores',{ feStoreList:'list' }),...mapState('User',{ feUserID:'id' }),
        feValuesStore(){
            let list = this.feStoreList, key = 'id', label = 'name', listArray = _.map(list,(store) => _.zipObject([key,label],[store.id,store.name]));
            return _.map(list,(item) => [item.id,item.name,].join(': ')); //return { items:listArray, key, label };
        },
        feFieldStore(){ return { name:'store',label:'Store',type:'Picker',values:this.feValuesStore } },
    },
    methods: {
        ...mapActions({ feListFetchStore: 'Stores/_stockIfNot' }),
    },
    created() {
        this.feListFetchStore({ query:sql.format(user_assigned_stores,this.feUserID),key:'list' })
    }
};
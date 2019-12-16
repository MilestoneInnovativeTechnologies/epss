import {mapActions, mapState} from "vuex";
import {login_user_assigned_stores} from "../../queries";

export const FormElementMixinStore = {
    computed: {
        ...mapState('Stores',{ feStoreList:'list' }),...mapState('User',{ feUserID:'id' }),
        feValuesStore(){
            let list = this.feStoreList, key = 'id', label = 'name', listArray = _.map(list,(store) => _.zipObject([key,label],[store[key],store[label]]));
            return { items:listArray, key, label };
        },
        feFieldStore(){ return { name:'store',label:'Store',type:'Picker',values:this.feValuesStore,hidden:(this.feValuesStore.items.length === 1) } },
    },
    methods: {
        ...mapActions({ feListFetchStore: 'Stores/_stockIfNot' }),
    },
    created() {
        this.feListFetchStore({ query:login_user_assigned_stores,key:'list' })
    }
};
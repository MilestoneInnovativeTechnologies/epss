import { mapGetters } from 'vuex';

const vars = ['_ref','user','store','fycode','fncode','docno','date','customer','payment_type','status','direction','transaction'];
const def_val = { payment_type:'Cash',customer:null,status:'Active' };
const dir_fns = { 'Out':['MT2','SL1','SL2','SL3','SL3','SL5'],'In':['MT1','SR1','SR2'] };

export const TransactionPack = {
    data(){
        let TP = _.zipObject(vars,Array(vars.length).fill(null));
        return { TP }
    },
    computed: {
        ...mapGetters({ TPDate:'date',TPUser:'user',TPRef:'_ref',TPDoc:'Reserves/get',TPtoDateTime:'toDateTime' }),
    },
    methods: {
        TP__ref(){ return this.TP.transaction = this.TPRef() },
        TP_docno(){ return this.TPDoc(this.store,this.fycode,this.fncode) },
        TP_date(){ return this.TPtoDateTime(this.TPDate()) },
        TP_user(){ return this.TPUser },
        TP_direction(){ return _.findKey(dir_fns,(ary) => _.includes(ary,this.TP.fncode)) },
    },
    created(){
        for(let x in vars){
            let y = vars[x];
            if(_.hasIn(this.$props,y)) this.TP[y] = this[y];
            else if(_.hasIn(this,'TP_'+y) && typeof this['TP_'+y] === 'function') this.TP[y] = this['TP_'+y]();
            else if(_.hasIn(this,'TP_'+y)) this.TP[y] = this['TP_'+y];
            else if(_.hasIn(this,y) && typeof this[y] === 'function') this.TP[y] = this[y]();
            else if(_.hasIn(this,y)) this.TP[y] = this[y];
            else if(_.has(def_val,y)) this.TP[y] = def_val[y];
        }
    }
};
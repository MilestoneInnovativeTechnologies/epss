<template>
    <GridLayout rows="auto" columns="*,auto">
        <TextTitle row="0" col="0" :key="'wsscn'+name">{{ name }}</TextTitle>
        <TextItalic row="0" col="1" class="text-underline cp text-right p-t-5" @tap.native="changeDetail">Change Details</TextItalic>
    </GridLayout>
</template>

<script>
    import { mapGetters } from 'vuex';
    export default {
        name: "WSSaleCustomer",
        data(){ return {
            keys: ['date','customer','store','type','fycode','payment'],
            date: null, customer: null, store: null, type: null,
            fycode: null, payment: null
        } },
        computed: {
            ...mapGetters({ getCustomer:'Customer/customer' }),
            name(){ return this.customer ? _.get(this.getCustomer(this.customer),'name') : 'SELECT CUSTOMER' },
            askProps(){ let vm = this; return _.zipObject(this.keys,_.map(this.keys,(key) => vm[key])) }
        },
        methods: {
            changeDetail(){ console.log('Change Customer details'); this.askCustomerDetail(); },
            askCustomerDetail(){ this.$showModal(require('./WSSaleCustomerModal').default, { fullscreen:true,props:this.askProps })
                .then(data => { this.setSaleDetail(data) })
            },
            setSaleDetail(data){
                let vm = this; _.forEach(data,(value,key) => vm[key] = value);
                EB.$emit('wssale-sale-detail',data); EB.$emit('sale-fncode',data.type);
            }
        },
        mounted(){
            let vm = this;
            this.$nextTick(() => {
                if(!vm.customer) vm.askCustomerDetail();
            })
        }
    }
</script>
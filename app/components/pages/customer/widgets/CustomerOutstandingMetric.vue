<template>
    <AppMetric :items="items"></AppMetric>
</template>

<script>
    import { mapState,mapGetters,mapActions } from 'vuex'

    export default {
        name: "CustomerOutstandingMetric",
        props: ['id'],
        data(){ return {
            query: `SELECT outstanding, overdue FROM users WHERE id = ${this.id}`,
            metricTemplate: ['outstanding','overdue'],
            metricIcons: ['attach_money','warning'],
            size:25, coloured: true, itemKeys: ['coloured','size','icon','text','title']
        }},
        computed:{
            ...mapGetters('Customer',['_tableDataItem']), ...mapState('Customer',['outstanding']),
            customer(){ return this._tableDataItem('users',this.id) },
            outstandings(){ return _.mapValues(this.outstanding[this.id][0],(item) => __.amount(item)) },
            items(){ let vm = this; return _.map(this.metricTemplate,(item,idx) => _.zipObject(['coloured','size','title','text','icon'],[vm.coloured,vm.size,item,vm.outstandings[item],vm.metricIcons[idx]])) },
        },
        methods: {
            ...mapActions('Customer',['_stockIfNot'])
        },
        created() {
            this._stockIfNot({ query:this.query,key:'outstanding',path:this.id })
        }
    }
</script>
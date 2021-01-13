<template>
    <AppList :source="source" v-bind="bind"></AppList>
</template>

<script>
    import { mapState,mapActions } from 'vuex';
    import { TransactionQueryBuilder } from './../../../../assets/scripts/services/transactionquery'
    export default {
        name: "RecentTransactionList",
        inheritAttrs: false,
        props: ['path','fields','condition','max','on','cast','trType'],
        data(){ return {
            defaultMax: 100, defaultCon: {}, defaultOn: 3,
            defaultKey: 'transactions', defaultPath: 'temp',
        } },
        computed: {
            ...mapState('Sales',['transactions']),
            TQB(){ return new TransactionQueryBuilder(this.trType).fields(this.fields).where(this.condition || this.defaultCon).max(this.max || this.defaultMax) },
            bind(){ let qbFields = _.keys(this.TQB.fieldMaps); return _.omit(this.$attrs,qbFields) },
            records(){ let path = this.path || this.defaultPath; return (_.has(this[this.defaultKey],path)) ? this[this.defaultKey][path] : [] },
            source(){ let cast = this.cast; return _.isEmpty(this.cast) ? this.records : _.map(this.records,(record) => _.mapValues(record,(value,name) => _.has(cast,name) ? __[cast[name]](value) : value)) }
        },
        methods: {
            ...mapActions('Sales',['_stockIfNot']),
        },
        created(){
            this._stockIfNot({ query:this.TQB.query(),key:this.defaultKey,path:(this.path || this.defaultPath) ,on:(this.on || this.defaultOn) })
        }
    }
</script>
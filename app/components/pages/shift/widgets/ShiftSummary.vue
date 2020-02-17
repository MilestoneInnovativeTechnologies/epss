<template>
    <StackLayout v-if="ready">
        <TextTitleSubSmall v-if="title" class="m-t-15 m-b-8" :text="title" />
        <GridLayout rows="auto,auto" :columns="Array(summary.length).fill('*').join(',')">
            <AppInfoWithLabel row="0" col="0" title="Opening" :text="opening" />
            <AppInfoWithLabel row="0" col="1" title="Drops" :text="0-transSum('cash','SDRP')" />
            <AppInfoWithLabel row="0" col="2" title="Cash Transactions" :text="transSum('cash') - transSum('cash','SDRP')" colSpan="2" />
            <AppInfoWithLabel class="m-t-8" v-for="(title,idx) in summary" :col="idx" :row="1" :title="title" :text="transSum(title)" :key="'sss2-'+title" />
        </GridLayout>
        <AppList class="m-t-15" title="Shift Transactions" :source="source" :layout="{ FN:'fncode',Amount:'total',Bal:'balance' }" />
        <GridLayout columns="*,*">
            <AppInfoHighlight col="0" class="m-t-15" title="Balance">{{ balance }}</AppInfoHighlight>
            <AppInfoHighlight col="1" class="m-t-15" title="Cash In Hand">{{ cashInHand() }}</AppInfoHighlight>
        </GridLayout>
    </StackLayout>
</template>

<script>
    import {get_shift_transactions} from "../../../../assets/scripts/queries";
    import {mapActions} from "vuex";

    export default {
        name: "ShiftSummary",
        props: ['shift','title'],
        data(){ return {
            details: {}, ready: false, balance: 0,
            summary: ['credit','card','cheque','digitalwallet'],
            summary1: ['opening','drops','cash'],
        } },
        computed: {
            opening(){ return __.amount(this.details.opening) },
            transactions(){ return this.$store.state.Shift.transactions[this.shift] },
            source(){ return [{ fncode:'SHF/Opening',total:this.opening,balance:this.opening }].concat(this.transactions.map(trans => { let ttl = total(trans); return _(trans).set('total',ttl).set('balance',this.balance += ttl).value() })) },
        },
        methods: {
            ...mapActions({ stock:'Shift/_stock' }),
            transSum(key,fn){ return __.amount(_.sumBy(this.transactions,trans => _.toNumber((fn && trans['fncode'] != fn) ? 0 : trans[key]))) },
            cashInHand(){ return this.opening + this.transSum('cash') },
        },
        created(){
            if(!this.shift) return; this.balance = 0;
            DB.get('shift',{ _ref:this.shift },function(vm){ vm.details = this.result[0]; vm.ready = true; vm.balance = vm.opening },this);
            this.stock({ query:sql.format(get_shift_transactions,[this.shift]),key:'transactions',path:this.shift });
        },
        mounted(){
            this.$emit('summary',{ cashInHand:this.cashInHand(), balance:this.balance })
        }
    }
    function total(obj){ return _(obj).pick(['cash','credit','digitalwallet','cheque','card']).values().map(_.toNumber).sum(); }
</script>
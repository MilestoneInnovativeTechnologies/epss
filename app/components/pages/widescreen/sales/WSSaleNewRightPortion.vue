<template>
    <GridLayout columns="*,110" :rows="rows.join(',')">
        <WSSaleList02 row="0" col="0" v-if="list02" :list="list02"></WSSaleList02>
        <StackLayout row="0" col="1"  v-if="list02"></StackLayout>
        <WSSaleContainer :row="rows.length-1" col="0"></WSSaleContainer>
        <WSSaleList01 :row="rows.length-1" col="1" :list="list01"></WSSaleList01>
    </GridLayout>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: "WSSaleNewRightPortion",
        data(){ return {
            fncode: null,
            defaultList: '01'
        }},
        computed: {
            ...mapGetters({ getFunctionDetails:'FN/details'}),
            rows(){ let rows = ['*']; if(this.list02) rows.unshift('70'); return rows; },
            list(){ return this.fncode ? _.get(this.getFunctionDetails(this.fncode),'list',this.defaultList) : this.defaultList },
            list01(){ return this.list.split('|')[0] },  list02(){ return this.list.split('|')[1] },
        },
        created(){
            EB.$on('wssale-sale-detail',function(data){ this.fncode = data.type });
        }
    }
</script>
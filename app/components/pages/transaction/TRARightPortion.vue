<template>
    <GridLayout :columns="['*',properties.list01].join(',')" :rows="rows.join(',')">
        <TRAList02 row="0" col="0" v-if="list02" :list="list02"></TRAList02>
        <StackLayout row="0" col="1"  v-if="list02"></StackLayout>
        <TRAItemsContainer :properties="properties" :row="rows.length-1" col="0" :list1="list01" :list2="list02"></TRAItemsContainer>
        <TRAList01 :row="rows.length-1" col="1" :list="list01"></TRAList01>
    </GridLayout>
</template>

<script>
    import { mapGetters } from 'vuex';

    const defaultList = '01';

    export default {
        name: "TRARightPortion",
        props: ['properties','fncode'],
        data(){ return {
            PG: ''
        }},
        computed: {
            ...mapGetters({ FN:'FN/details'}),
            rows(){
                let rows = ['*'];
                if(this.list02) rows.unshift(this.properties.list02);
                return rows;
            },
            list01(){ return this.PG.split('|')[0] },
            list02(){ return this.PG.split('|')[1] },
        },
        created(){
            this.PG = _.get(this.FN(this.fncode),'list',defaultList);
        }
    }
</script>
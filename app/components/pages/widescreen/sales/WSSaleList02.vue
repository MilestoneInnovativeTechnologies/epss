<template>
    <FlexboxLayout flexDirection="row" class="c-bg-white">
        <StackLayout width="110" :class="selected === 0 ? 'bcg01' : ''" verticalAlignment="middle" key="list02-0" @tap="setSelected(0)">
            <TextHighlightBold class="text-center p-x-5" textWrap="true">All</TextHighlightBold>
        </StackLayout>
        <StackLayout width="110" :class="selected === l2Id ? 'bcg01' : ''" verticalAlignment="middle" v-for="(name,l2Id) in listNames" :key="'list02-'+l2Id" @tap="setSelected(l2Id)">
            <TextHighlightBold class="text-center p-x-5" textWrap="true">{{ name }}</TextHighlightBold>
        </StackLayout>
    </FlexboxLayout>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: "WSSaleList02",
        props: ['list'],
        data(){ return {
            list01: null,
            list01num: null,
            selected: 0,
        }},
        created(){
            EB.$on('wssale-selected-list01',function(data){ this.list01 = data[0]; this.list01num = data[1]; })
        },
        computed: {
            ...mapGetters({ getList02Id:'Product/list02',listDetail:'Product/groups' }),
            listIds(){ return this.getList02Id(this.list,this.list01,this.list01num) },
            listNames(){ let ids = this.listIds; return _.mapValues(_.pick(this.listDetail,ids),'name') },
        },
        methods: {
            setSelected(idx){ this.selected = idx; EB.$emit('wssale-selected-list02',[this.list,this.selected]) }
        },
        created(){
            EB.$on('wssale-selected-list01',(data) => { this.list01 = data[0]; this.list01num = data[1]; this.selected = 0 });
            this.setSelected(0);
        },

    }
</script>
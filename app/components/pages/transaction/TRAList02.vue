<template>
    <ScrollView  orientation="horizontal">
        <FlexboxLayout flexDirection="row" class="c-bg-white">
            <StackLayout width="110" :class="selected === 0 ? 'bcg01' : ''" verticalAlignment="middle" key="list02-0" @tap="setSelected(0)">
                <TextHighlightBold class="text-center p-x-5" textWrap="true">All</TextHighlightBold>
            </StackLayout>
            <StackLayout width="110" :class="selected === l2Id ? 'bcg01' : ''" verticalAlignment="middle" v-for="(name,l2Id) in listNames" :key="'list02-'+l2Id" @tap="setSelected(l2Id)">
                <TextHighlightBold class="text-center p-x-5" textWrap="true">{{ name }}</TextHighlightBold>
            </StackLayout>
        </FlexboxLayout>
    </ScrollView>
</template>

<script>
    import { mapGetters } from 'vuex';
    import {EventListeners} from "../../../assets/scripts/mixins/eventlisteners";

    export default {
        name: "TRAList02",
        mixins: [EventListeners],
        props: ['list'],
        data(){ return {
            list01: null,
            list01num: null,
            selected: 0,
            events: ['tra-list01-changed'],
        }},
        computed: {
            ...mapGetters({ getList02Id:'Product/list02',listDetail:'Product/groups' }),
            listIds(){ let list = this.list01, listNum = this.list01num; return this.getList02Id(this.list,list,listNum) },
            listNames(){ let ids = this.listIds; return _.mapValues(_.pick(this.listDetail,ids),'name') },
        },
        methods: {
            setSelected(idx){
                this.selected = idx;
                EB.$emit('tra-list02-changed',this.selected);
            },
            updateListChanges(list01,list01num){
                this.list01 = list01;
                this.list01num = list01num;
            },
            listener0(data){ this.updateListChanges(data[0],data[1]) }
        },
        created(){ this.setSelected(0); },

    }
</script>
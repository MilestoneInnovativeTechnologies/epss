<template>
    <ScrollView  orientation="horizontal">
        <FlexboxLayout flexDirection="row" class="c-bg-white">
            <StackLayout width="110" :class="selected === 0 ? 'bcg02' : ''" verticalAlignment="middle" key="list02-0" @tap="setSelected(0)">
                <TextHighlightBold class="text-center p-x-5" textWrap="true">All</TextHighlightBold>
            </StackLayout>
            <StackLayout width="110" :class="selected === l2Id ? 'bcg02' : ''" verticalAlignment="middle" v-for="(name,l2Id) in listNames" :key="'list02-'+l2Id" @tap="setSelected(l2Id)">
                <TextHighlightBold class="text-center p-x-5" textWrap="true" :text="name" />
            </StackLayout>
        </FlexboxLayout>
    </ScrollView>
</template>

<script>
    import { mapGetters } from 'vuex';
    import {EventListeners} from "../../../assets/scripts/mixins/eventlisteners";
	const timer = require('@nativescript/core/timer');

    export default {
        name: "TRAList02",
        mixins: [EventListeners],
        props: ['list','seq'],
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
                clickTune.play(); this.selected = idx;
                EB.$emit('tra-list02-changed',[this.list,this.selected]);
            },
            updateListChanges(list01,list01num){
                this.list01 = list01;
                this.list01num = list01num;
            },
            listener0(data){ this.updateListChanges(data[0],data[1]); timer.setTimeout((vm) => vm.listIds.includes(vm.selected) ? null : vm.setSelected(0),1000,this) }
        },
        watch: {
            seq: { immediate:true, handler:function(){ this.setSelected(0) } }
        }
    }
</script>

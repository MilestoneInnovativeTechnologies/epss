<template>
    <ScrollView>
        <FlexboxLayout flexDirection="column" class="c-bg-white">
            <StackLayout :class="selected === l1Id ? 'bcg01' : ''" height="110" verticalAlignment="middle" v-for="(name,l1Id) in listNames" :key="'list01-'+l1Id" @tap="setSelected(l1Id)">
                <TextHighlightBold class="text-center w-full" textWrap="true" :text="name" />
            </StackLayout>
        </FlexboxLayout>
    </ScrollView>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: "TRAList01",
        props: ['list','seq'],
        data(){ return {
            selected: 0,
        }},
        computed: {
            ...mapGetters({ getList01Id:'Product/list01',listDetail:'Product/groups' }),
            listIds(){ return this.getList01Id(this.list) },
            listNames(){ let ids = this.listIds; return _.mapValues(_.pick(this.listDetail,ids),'name') },
        },
        methods: {
            setSelected(idx){
                this.selected = idx;
                EB.$emit('tra-list01-changed',[this.list,this.selected])
            }
        },
        watch: {
            seq: { immediate:true, handler:function(){ this.setSelected(this.listIds[0]) } }
        }
        // created(){ this.setSelected(this.listIds[0]); }
    }
</script>

<template>
    <TextRegular :class="classes" @tap.native="tapped" :textWrap="wrap" :text="text"></TextRegular>
</template>

<script>
    import { AppListLinkNavigate } from './../../../assets/scripts/mixins/applistlink';
    import { AppListDetailUpdate } from './../../../assets/scripts/mixins/applistupdate';

    const clsTypeDataMap = { NORMAL:'normalClass',LINK:'mixinLinkClasses',ALDU:'ALDU_linkClasses' };
    const methodTypeMethodMap = { LINK:'_linkNavigate',ALDU:'ALDU_do' };

    export default {
        name: "AppListBodyColumnContent",
        mixins: [AppListLinkNavigate,AppListDetailUpdate],
        props: ['text','item','path','wrap'],
        computed: {
            normalClass(){ return [] },
            textWrap(){ return this.wrap },
            type(){ return this.ALDU_is(this.path) ? 'ALDU' : (this._linkHas(this.path) ? 'LINK' : 'NORMAL') },
            classes(){ return this[clsTypeDataMap[this.type]] },
        },
        methods: {
            tapped(){
                let { type,path } = this; if(type === 'NORMAL') return;
                return this[methodTypeMethodMap[type]](path);
            }
        }
    }
</script>
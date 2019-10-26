<template>
    <TextRegular :class="classes" @tap.native="tapped" :textWrap="wrap" :text="$slots.default[0].text"></TextRegular>
</template>

<script>
    import { AppListLinkNavigate } from './../../../assets/scripts/mixins/applistlink';
    import { AppListDetailUpdate } from './../../../assets/scripts/mixins/applistupdate';

    const clsTypeMethodMap = { NORMAL:'normalClass',LINK:'_linkClass',ALDU:'ALDU_class' };
    const methodTypeMethodMap = { LINK:'_linkNavigate',ALDU:'ALDU_do' };

    export default {
        name: "AppListBodyColumnContent",
        mixins: [AppListLinkNavigate,AppListDetailUpdate],
        props: ['item','path','wrap'],
        computed: {
            textWrap(){ return this.wrap },
            type(){ return this.ALDU_is(this.path) ? 'ALDU' : (this._linkHas(this.path) ? 'LINK' : 'NORMAL') },
            classes(){ let path = this.path, type = this.type; return this[clsTypeMethodMap[type]](path) },
        },
        methods: {
            normalClass(){ return []; },
            tapped(){
                let { type,path } = this; if(type === 'NORMAL') return;
                return this[methodTypeMethodMap[type]](path);
            }
        }
    }
</script>
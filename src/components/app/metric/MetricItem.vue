<template>
    <GridLayout :rows="rows" columns="*" class="m-4 p-15 metric-item" @tap="navigate">
        <FontIcon row="0" col="0" v-if="icon" :style="iconStyle" class="cp text-center m-b-0" verticalAlignment="bottom">{{ icon }}</FontIcon>
        <TextDisplay row="1" col="0" verticalAlignment="middle" class="m-0 p-0" :class="displayClass" :size="displaySize" :text="text" />
        <TextTitleSub row="2" col="0" v-if="title" class="text-center cp m-t-0" verticalAlignment="top" :text="title"></TextTitleSub>
    </GridLayout>
</template>

<script>
    export default {
        name: "MetricItem",
        props: {
            icon:{ default:null },
            text:{ default:'display' },
            title:{ default:null },
            coloured: { default:false },
            size: { default:40 },
            detail: { default:null },
            args: { default:null }
        },
        computed: {
            iconStyle(){ return { fontSize:(this.size-5)+'' } },
            displaySize(){ return this.size+5 },
            displayClass(){ return this.coloured === false ? [] : ['cp'] },
            rows(){ return [this.icon ? '*' : 0,'auto',this.title ? '*' : 0].join(',') },
        },
        methods: {
            navigate(){
                if(!this.detail) return;
                let component = require('../../pages/'+this.detail+'.vue').default;
                this.$navigateTo(component,{ props:this.args })
            }
        }
    }
</script>

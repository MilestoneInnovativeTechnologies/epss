<!--suppress ALL -->
<template>
    <FontIcon size="24" @tap.native="$navigateTo(navComp,navProps)">keyboard_arrow_right</FontIcon>
</template>

<script>
    export default {
        name: "AppListActionDetail",
        props: {
            link: { type:String,default:'' },
            props: { type:Object,default:()=>{ return {} } },
        },
        computed: {
            transactions(){ return { transition: {}, transitioniOS: {}, transitionAndroid: {} } },
            navComp(){ return require('./../../pages/' + this.link + '.vue').default },
            navProps(){ return { props:this.props,...(this.transactions) } }
        }
    }
</script>
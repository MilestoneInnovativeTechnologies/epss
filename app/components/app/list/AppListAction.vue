<!--suppress ALL -->
<template>
    <Image backgroundColor="#F5F5F5" src="res://detail" stretch="aspectFit" @tap="$navigateTo(navComp,navProps)" />
</template>

<script>
    export default {
        name: "AppListAction",
        props: {
            link: { type:String,default:'' },
            props: { type:Object,default:()=>{ return {} } },
        },
        computed: {
            navComp(){ return require('./../../pages/' + this.link + '.vue').default },
            navProps(){ return { props:this.props } }
        }
    }
</script>
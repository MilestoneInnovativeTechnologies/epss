<!--suppress ALL -->
<template>
    <Image backgroundColor="#F5F5F5" src="res://detail" stretch="aspectFit" @tap="$navigateTo(navigate,navProps)" />
</template>

<script>
    export default {
        name: "AppListAction",
        props: {
            link: { type:String,default:'' },
            props: { type:Object,default:{} },
        },
        computed: {
            navigate(){ return require('./../../pages/' + this.link + '.vue').default },
            navProps(){ return { props:this.props } }
        }
    }
</script>
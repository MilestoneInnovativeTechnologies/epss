<template>
    <App title="Store Details">
        <HtmlView :html="html"></HtmlView>
    </App>
</template>

<script>
    export default {
        name: "StoreDetail",
        props: ['id'],
        computed: {
            html(){ return `<h1>Store ${this.id}</h1>` }
        }
    }
</script>
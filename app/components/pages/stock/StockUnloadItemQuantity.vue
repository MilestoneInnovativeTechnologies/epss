<template>
    <App title="Change Stock unload quantity">
<!--        <AppForm action="Done"></AppForm>-->
    </App>
</template>

<script>
    import AppForm from "../../app/form/AppForm";
    const feMX = require('./../../../assets/scripts/mixins/formelement');

    export default {
        name: "StockUnloadItemQuantity",
        // mixins: [feMX.common, feMX.quantity],
        props: ['id','max','current','delegate'],
        methods: {
            fields(){
                //let fields =
            }
        }
    }
</script>
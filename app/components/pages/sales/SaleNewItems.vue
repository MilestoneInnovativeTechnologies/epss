<template>
    <App title="NEW SALE - ITEMS" action="SAVE" @save="save">
        <GridLayout rows="auto,*,auto">
            <AppList row="0" :source="tblSource" :layout="tblLayout" action="remove" @collection="collections"></AppList>
            <StackLayout visibility="collapsed" row="1"><Label text="2" backgroundColor="#FF0000"></Label></StackLayout>
            <StackLayout visibility="collapsed" row="2">
                <GridLayout columns="*,auto">
                    <Label col="0" text=""></Label>
                    <FontIcon col="1" size="24" class="text-right bcp p-5 elevate-2 font-weight-bold c-white">clear</FontIcon>
                </GridLayout>
                <GridLayout rows="auto,auto,auto" columns="*" style="border-width:5; border-color: #FFA656;">
                    <GridLayout row="0" col="0" rows="auto" columns="65*,35*">
                        <AppForm col="0" :fields="appFormFields(pField)"></AppForm>
                        <AppForm col="1" :fields="appFormFields(qField)"></AppForm>
                    </GridLayout>
                    <GridLayout row="1" col="0" rows="auto" columns="*,*,*" class="p-24">
                        <AppInfoWithLabel row="0" col="0" title="PRICE">8</AppInfoWithLabel>
                        <AppInfoWithLabel row="0" col="1" title="TAX">230</AppInfoWithLabel>
                        <AppInfoWithLabel row="0" col="2" title="TOTAL">0000</AppInfoWithLabel>
                    </GridLayout>
                    <Button row="2" col="0" text="Hellooo" class="bcp c-white p-y-20 font-weight-bold"/>
                </GridLayout>
            </StackLayout>
        </GridLayout>
    </App>
</template>

<script>
    import AppList from "../../app/list/AppList";
    const feMX = require("./../../../assets/scripts/mixins/formelement");

    export default {
        name: "SaleNewItems",
        components: {AppList},
        props: ['master'],
        data() {
            return {
                pField: {product: 'Product'},
                qField: {quantity: 'Quantity'},

                tblSource: [{product:'ABC',quantity:12,rate:12},{product:'XYZ',quantity:22,rate:2}],
                tblLayout: { Product:'product', Quantity:'quantity', Rate:'rate' }
            }
        },
        mixins: [feMX.common, feMX.product, feMX.quantity],
        methods: {
            collections(coll){
                console.log(_.cloneDeep(coll));
            },
            save() {
                console.log('Ready to save')
            },
        },
    }
</script>
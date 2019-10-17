<template>
    <Page>
        <GridLayout rows="*,auto,*" columns="*">
            <StackLayout row="0" col="0"></StackLayout>
            <StackLayout row="1" col="0" width="480">
                <AppForm :fields="appFormFields()" :values="values" @final="setSelectedData"></AppForm>
                <AppButton @tap.native="proceed" bcc="bcp" text="Proceed" />
            </StackLayout>
            <StackLayout row="2" col="0"></StackLayout>
        </GridLayout>
    </Page>
</template>

<script>
    const feMX = require('./../../../../assets/scripts/mixins/formelement');
    import { mapGetters } from 'vuex';
    export default {
        name: "WSSaleCustomerModal",
        mixins: [feMX.common,feMX.customer,feMX.store,feMX.fiscal,feMX.datepicker,feMX.payment],
        props: ['customer','store','type','fycode','date','payment'],
        data(){ return {
            fieldLayout: { customer:'Customer',store:'Store',type:'SalesType',fycode:'Fiscal',date:'DatePicker',payment:'Payment' },
            final: {},
        }},
        computed: {
            ...mapGetters({ datetime:'datetime' }),
            values(){ return {
                date:this.date || this.datetime(),
                customer: this.customer || null,
                store: this.store || null,
                type: this.type || null,
                fycode: this.fycode || null,
                payment: this.payment || null,
            } }
        },
        methods: {
            setSelectedData(data){ this.final = Object.assign({},this.final,data); },
            proceed(){ this.$modal.close(this.final) }
        }

    }
</script>
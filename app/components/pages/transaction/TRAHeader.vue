<template>
    <GridLayout rows="auto,auto,auto" columns="*,auto">
        <AppInfoWide row="0" col="0" title="Customer" :key="'trah-cus-'+uKey">{{ name }}</AppInfoWide>
        <AppInfoWide row="1" col="0" title="Date" :key="'trah-dte-'+uKey">{{ docdate }}</AppInfoWide>
        <AppInfoWide row="2" col="0" title="Payment Mode" :key="'trah-pym-'+uKey">{{ payment_type }}</AppInfoWide>
        <GridLayout row="0" col="1" rowSpan="3" rows="40,40" columns="140" class="m-l-15">
            <AppButton height="50" row="0" @tap.native="deleteHeader" class="c-white fs10">Cash Customer</AppButton>
            <AppButton height="50" row="1" @tap.native="changeHeader" class="c-white fs10">Change Customer</AppButton>
        </GridLayout>
    </GridLayout>
</template>

<script>
    import {EventListeners} from "../../../assets/scripts/mixins/eventlisteners";
    import { mapGetters,mapState,mapActions } from "vuex";
    import {ThisObj} from "../../../assets/scripts/mixins/tobj";
    import {user_assigned_area_customers} from "../../../assets/scripts/queries";

    const feMX = require('./../../../assets/scripts/mixins/formelement');
    const values = { customer:null,date:moment().format('YYYY-MM-DD'),payment_type:'Cash' };

    const title = 'Update Details';
    const fields = { customer:'Customer',date:'DatePicker',payment_type:'Payment' };

    export default {
        name: "TRAHeader",
        mixins: [EventListeners,ThisObj,feMX.common,feMX.customer,feMX.datepicker,feMX.payment],
        data(){ return {
            customer: values.customer, date:values.date, payment_type:values.payment_type, uKey:0
        } },
        computed: {
            ...mapGetters({ detail:'Customer/_stateDataItem',user:'User' }), ...mapState('Customer',['list']),
            name(){ return this.customer ? (this.detail('list',this.customer) || { name:'Cash Customer' }).name : 'Cash Customer' },
            docdate(){ return __.docdate(this.date) },
        },
        methods: {
            ...mapActions('Customer',{ stockCustomer:'Customer/_stockIfNot' }),
            changeHeader(){
                this.ELOn('absolute-form-submit',this.setHeader); this.ELOn('absolute-form-close',this.closeRequest);
                this.ELEmit('absolute-form',{ title,fields:this.appFormFields(fields),values,action:'Update' });
            },
            deleteHeader(){ this.setHeader(values);  },
            setHeader(data){ this.ELEmit('tra-header',data); this.TO_SetPropFromObj(data); this.closeRequest(); this.uKey++; },
            closeRequest(){
                this.ELEmit('absolute-form');
                this.ELOff('absolute-form-submit',this.setHeader);
                this.ELOff('absolute-form-close');
            }
        },
        created(){ if(this.list.length === 0) this.stockCustomer({ query:sql.format(user_assigned_area_customers,this.user),key:'list' }); },
        mounted(){ this.deleteHeader() }
    }
</script>
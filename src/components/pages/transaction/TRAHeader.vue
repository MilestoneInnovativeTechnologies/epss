<template>
    <!--<GridLayout rows="auto,auto,auto" columns="*,auto">
        <AppInfoWide row="0" col="0" title="Customer" :text="name" />
        <AppInfoWide row="1" col="0" title="Date" :text="docdate" />
        <AppInfoWide row="2" col="0" title="Payment Mode" :text="payment_type" />
        <GridLayout row="0" col="1" rowSpan="3" rows="40,40" columns="140" class="m-l-15">
            <AppButton height="50" row="0" @tap.native="deleteHeader" class="c-white fs10">Cash Customer</AppButton>
            <AppButton height="50" row="1" @tap.native="changeHeader" class="c-white fs10">Change Customer</AppButton>
        </GridLayout>
    </GridLayout>-->
    <FlexboxLayout>
        <TextHeadingRowSub class="p-t-12" :text="name + ', '" justifyContent="center" />
        <TextHeadingRowSub class="p-t-12 p-l-20" :text="docdate + ', '" />
        <TextHeadingRowSub class="p-t-12 p-l-20" :text="payment_type" flexGrow="1" />
        <AppButton height="40" @tap.native="changeHeader" class="c-white fs10">Change</AppButton>
    </FlexboxLayout>

</template>

<script>
    import {EventListeners} from "../../../assets/scripts/mixins/eventlisteners";
    import { mapGetters,mapState,mapActions } from "vuex";
    import {ThisObj} from "../../../assets/scripts/mixins/tobj";
    import {login_user_area_customers} from "../../../assets/scripts/queries";

    const feMX = require('./../../../assets/scripts/mixins/formelement');

    const title = 'Update Details';
    const fields = { customer:'Customer',date:'DatePicker',payment_type:'Payment' };

    export default {
        name: "TRAHeader",
        mixins: [EventListeners,ThisObj,feMX.common,feMX.customer,feMX.datepicker,feMX.payment],
        props: ['seq'],
        data(){ return {
            customer: null, date:__.datez(), payment_type:'Cash',
        } },
        computed: {
            ...mapGetters({ detail:'Customer/_stateDataItem',user:'user' }), ...mapState('Customer',['list']),
            name(){ return this.customer ? (this.detail('list',this.customer) || { name:'Cash Customer' }).name : 'Cash Customer' },
            docdate(){ return __.docdate(this.date) },
            values(){ return { customer: this.customer,date: this.date,payment_type: this.payment_type } }
        },
        methods: {
            ...mapActions('Customer',{ stockCustomer:'_stockIfNot' }),
            changeHeader(){
                clickTune.play();
                this.ELOn('absolute-form-submit',this.setHeader); this.ELOn('absolute-form-close',this.closeRequest);
                this.ELEmit('absolute-form',{ title,fields:this.appFormFields(fields),values:this.values,action:'Update' });
            },
            deleteHeader(){ this.setHeader({ customer: null, date: __.datez(new Date()), payment_type: 'Cash' });  },
            setHeader(data){ this.ELEmit('tra-header',data); this.TO_SetPropFromObj(data); this.closeRequest(); },
            closeRequest(){
                this.ELEmit('absolute-form');
                this.ELOff('absolute-form-submit',this.setHeader);
                this.ELOff('absolute-form-close');
            }
        },
        created(){ if(this.list.length === 0) this.stockCustomer({ query:sql.format(login_user_area_customers,this.user),key:'list' }); },
        watch: {
            seq: { immediate:true, handler:'deleteHeader' }
        },
    }
</script>

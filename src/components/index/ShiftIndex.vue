<template>
    <App :title="(fncode == 'SHF') ? 'Create Shift' : 'Shift Management'" @create-shift="ProceedCreateShift" :action="(fncode == 'SHF') ? 'Create Shift' : ''">
        <StackLayout v-if="fncode === 'SDRP'">
            <StackLayout v-if="shiftExists">
                <ShiftBasic title="Active Shift" :shift="shift._ref" />
                <ShiftSummary :shift="shift._ref" title="Summary" @summary="updateSummary" />
                <AlignBottom width="265" class="m-t-20">
                    <GridLayout columns="*,*" rows="auto">
                        <StackLayout row="0" col="0" @tap="startSafeDrop" :borderRadius="5" class="bcp font-weight-bold text-center c-white fs18 m-r-5" :height="80" :width="125">
                            <FontIcon class="m-t-12">format_size</FontIcon>
                            <TextBold class="c-white" style="color: #FFFFFF">Safe Drop</TextBold>
                        </StackLayout>
                        <StackLayout row="0" col="1" @tap="startClose" :borderRadius="5" class="bcp font-weight-bold text-center c-white fs18" :height="80" :width="125">
                            <FontIcon class="m-t-12">gesture</FontIcon>
                            <TextBold class="c-white" style="color: #FFFFFF">Close Shift</TextBold>
                        </StackLayout>
                    </GridLayout>
                </AlignBottom>
            </StackLayout>
            <StackLayout v-else>
                <TextTitleSubSmall text="No any active shift" />
            </StackLayout>
        </StackLayout>
        <StackLayout v-if="fncode === 'SHF'">
            <AppForm v-if="!shiftExists" :fields="fields" :values="{ amount:0 }" @final="updateOpening" />
            <TextTitleSubSmall v-else text="Shift already exists!" />
        </StackLayout>
    </App>
</template>

<script>
    import { mapActions } from 'vuex';
    import { ShiftIndex,Home } from "../../assets/scripts/navigations";
    const dialogs = require('@nativescript/core/ui/dialogs');

    const feMX = require('./../../assets/scripts/mixins/formelement');
    const fields = { amount:'Amount' };

    export default {
        name: "ShiftIndex",
        mixins: [feMX.common, feMX.amount],
        props: ['fycode','store','fncode'],
        data(){ return {
            summary: {}, opening: 0,
        } },
        computed: {
            user(){ return this.$store.state.User.id },
            shift(){ return _.last(this.$store.state.Shift.dbData['shift'].filter(({ user,end_date }) => (user == this.user && !end_date))) },
            fields(){ return this.appFormFields(fields) },
            shiftExists(){ return !!this.shift }
        },
        methods: {
            ...mapActions({ shiftSafeDrop:'Shift/drop',shiftDoClose:'Shift/shiftClose',createShift:'Shift/shiftCreate' }),
            updateSummary(data){ for(let x in data) this.summary = Object.assign({},this.summary,_.set({},x,_.toNumber(data[x]))) },
            updateOpening({ amount }){ this.opening = amount; },
            startSafeDrop(){
                let defaultText = _.toString(this.summary.cashInHand), inputType = dialogs.inputType.decimal, vm = this;
                prompt({
                    title: "SAFE DROP", message: "You are about to do safe drop, Please enter the amount and proceed to continue!", okButtonText: "Proceed", cancelButtonText: "Cancel", inputType, defaultText
                }).then(result => {
                    if(!result.result || _.toNumber(result.text) === 0) return; let cash = _.toNumber(result.text);
                    if(cash > vm.summary.cashInHand) return alert('Amount entered is greater than that in hand!! Please check and try again..');
                    this.shiftSafeDrop({ shift:this.shift._ref,cash:0-cash }).then(activity => this.$navigateTo(ShiftIndex.default,{ props:this.navProps(),backstackVisible:false }))
                });
            },
            startClose(){
                let defaultText = _.toString(this.summary.cashInHand), inputType = dialogs.inputType.decimal, vm = this;
                prompt({
                    title: "CLOSE SHIFT", message: "You are about to close this shift, Please enter the closing amount and proceed to continue!", okButtonText: "Proceed", cancelButtonText: "Cancel", inputType, defaultText
                }).then(result => {
                    if(!result.result) return; let closing = _.toNumber(result.text);
                    if(closing !== vm.summary.cashInHand && vm.shift.allow_difference === 'No') return alert('Closing difference is not allowed');
                    if(closing > vm.summary.cashInHand) return alert('Amount entered is greater than that in hand!! Please check and try again..');
                    this.shiftDoClose({ shift:this.shift._ref,closing }).then(activity => this.$navigateTo(ShiftIndex.default,{ props:this.navProps('SHF'),backstackVisible:false }))
                });
            },
            ProceedCreateShift() {
                this.createShift(this.opening).then(activity => this.$navigateTo(ShiftIndex.default, {props:this.navProps('SDRP'),backstackVisible: false}));
            },
            navProps(fncode){ return { fycode:this.fycode,store:this.store,fncode:fncode || this.fncode } },
        }
    }
</script>
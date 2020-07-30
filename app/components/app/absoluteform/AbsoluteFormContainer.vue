<template>
    <AlignMiddle>
        <StackLayout :width="width" class="bcg01 p-b-10">
            <GridLayout :width="width" rows="40" :columns="columns"  class="bordercp" style="border-width: 1">
                <Label row="0" col="0" class="bcp c-white fs12 fsb font-weight-bold p-t-10 p-l-8" :text="title" />
                <StackLayout v-if="closable" row="0" col="1" class="bcg01" verticalAlignment="center" @tap="formClose">
                    <FontIcon class="cp text-center w-full" size="28" name="cancel" />
                </StackLayout>
            </GridLayout>
            <AppForm :fields="fields" :values="formValues" @final="formData" />
            <TextItalic textWrap="true" v-if="notify" class="w-full text-center cp" :text="notification" />
            <Button @tap="formAction" class="bcp m-0 c-white fs12" v-if="action" :text="action" />
        </StackLayout>
    </AlignMiddle>
</template>

<script>
    import {EventListeners} from "../../../assets/scripts/mixins/eventlisteners";

    export default {
        name: "AbsoluteFormContainer",
        mixins: [EventListeners],
        props: ['fields', 'values', 'action', 'title', 'close', 'catch'],
        data(){ return {
            notification: '',
            notify: false,
            duration: 4000,
            maxWidth: 300,
            formValues: {},
            formFinalData: {},
            events: ['absolute-form-notify','absolute-form-values']
        } },
        computed: {
            width(){ let calc = parseInt(parseInt(this.$store.state['App'].width) * 85/100); return (calc > this.maxWidth) ? this.maxWidth : calc  },
            closable(){ return !(this.close === false || this.close === 'false') },
            columns(){ return this.closable ? '*,40' : '*' },
            catches(){ return this.catch ? (Array.isArray(this.catch) ? this.catch : [this.catch]) : [] }
        },
        methods: {
            setUpFormDataStorage(){
                let vm = this;
                Object.keys(this.fields).forEach(field => {
                    vm.$set(vm.formValues,field,_.get(vm.values,field,null));
                    vm.$set(vm.formFinalData,field,null);
                });
                // this.formValues = Object.assign({},this.formValues,nObj);
                // this.formFinalData = Object.assign({},this.formFinalData,nObj);
            },
            setNotification(text){
                this.notification = text; this.notify = true;
                setTimeout(() => { this.notification = ''; this.notify = false; },this.duration)
            },
            formData(data){
                let catches = this.catches;
                _.forEach(catches,(field) => EB.$emit('absolute-form-field-'+field,data[field]));
                _.keys(this.formFinalData).forEach(field => this.$set(this.formFinalData,field,data[field]));
                EB.$emit('absolute-form-data',this.formFinalData);
            },
            formClose(){ this.ELEmit('absolute-form-close'); },
            formAction(){ this.ELEmit('absolute-form-submit',this.formFinalData); },
            updateFormValue(data){
                console.log('updateFormValue',data,_.intersection(_.keys(data),_.keys(this.formValues)))
                _.intersection(_.keys(data),_.keys(this.formValues)).map(field => this.$set(this.formValues,field,data[field]));
            },
            listener0(data){ this.setNotification(data) },
            listener1(data){ this.updateFormValue(data) },
        },
        created(){
            this.setUpFormDataStorage(); this.updateFormValue(this.values);
        },
        watch: {
            values: {
                deep: true,
                handler: 'updateFormValue'
            }
        }
    }
</script>
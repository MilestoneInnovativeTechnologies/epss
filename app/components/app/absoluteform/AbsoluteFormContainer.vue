<template>
    <AlignMiddle>
        <StackLayout width="320" class="bcg01 p-b-10">
            <GridLayout width="320" rows="60" :columns="columns"  class="bordercp" style="border-width: 1">
                <Label row="0" col="0" class="bcp c-white fs20 fsb font-weight-bold p-10" :text="title" />
                <StackLayout v-if="closable" row="0" col="1" class="bcg01" verticalAlignment="center" @tap="formClose">
                    <FontIcon class="cp text-center w-full" size="35">cancel</FontIcon>
                </StackLayout>
            </GridLayout>
            <AppForm :key="uKey" :fields="fields" :values="formValues" @final="formData"></AppForm>
            <TextItalic textWrap="true" v-if="notify" class="w-full text-center cp">{{ notification }}</TextItalic>
            <Button @tap="formAction" class="bcp m-12 p-16 c-white fs15" v-if="action">{{ action }}</Button>
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
            formValues: {},
            formFinalData: {},
            uKey: 0,
            events: ['absolute-form-notify','absolute-form-values']
        } },
        computed: {
            closable(){ return !(this.close === false || this.close === 'false') },
            columns(){ return this.closable ? '*,60' : '*' },
            catches(){ return this.catch ? (Array.isArray(this.catch) ? this.catch : [this.catch]) : [] }
        },
        methods: {
            setUpFormDataStorage(){
                let nObj = Object.create({});
                Object.keys(this.fields).forEach(field => { this.$set(nObj,field,null); });
                this.formValues = Object.assign({},this.formValues,nObj); this.formFinalData = Object.assign({},this.formFinalData,nObj);
            },
            setNotification(text){
                this.notification = text; this.notify = true;
                setTimeout(() => { this.notification = ''; this.notify = false; },this.duration)
            },
            formData(data){
                let catches = this.catches;
                _.forEach(catches,(field) => EB.$emit('absolute-form-field-'+field,data[field]));
                _.keys(this.formFinalData).map(field => this.$set(this.formFinalData,field,data[field]));
                EB.$emit('absolute-form-data',this.formFinalData);
            },
            formClose(){ this.ELEmit('absolute-form-close'); },
            formAction(){ this.ELEmit('absolute-form-submit',this.formFinalData); },
            updateFormValue(data){
                _.intersection(_.keys(data),_.keys(this.formValues)).map(field => this.$set(this.formValues,field,data[field]));
                this.uKey++;
            },
            listener0(data){ this.setNotification(data) },
            listener1(data){ this.updateFormValue(data) },
        },
        created(){
            this.setUpFormDataStorage(); this.updateFormValue(this.values);
        }
    }
</script>
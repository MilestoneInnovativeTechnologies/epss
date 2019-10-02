<template>
    <AlignMiddle>
        <StackLayout width="420" class="bcg01 p-b-10">
            <GridLayout width="420" rows="60" :columns="columns">
                <Label row="0" col="0" class="bcp c-white fs20 fsb font-weight-bold p-10" :text="title" />
                <StackLayout v-if="closable" row="0" col="1" class="bcg01" verticalAlignment="center" @tap="formClose">
                    <FontIcon class="cp text-center w-full" size="40">cancel</FontIcon>
                </StackLayout>
            </GridLayout>
            <AppForm :fields="fields" :values="values" :action="action" @final="formData" @submit="formAction"></AppForm>
            <Label :text="notification" :key="notification.split(' ').join('-')" v-if="notify" class="w-full text-center fs20 cp" />
        </StackLayout>
    </AlignMiddle>
</template>

<script>
    export default {
        name: "AbsoluteFormContainer",
        props: ['fields', 'values', 'action', 'title', 'close'],
        data(){ return {
            notification: '',
            notify: false,
            duration: 4000
        } },
        computed: {
            closable(){ return !(this.close === false || this.close === 'false') },
            columns(){ return this.closable ? '*,60' : '*' }
        },
        methods: {
            setNotification(text){
                this.notification = text; this.notify = true;
                setTimeout(() => { this.notification = ''; this.notify = false; },this.duration)
            },
            formData(data){ console.log('absolute-form-data',data); EB.$emit('absolute-form-data',data); },
            formClose(){ console.log('absolute-form-close'); EB.$emit('absolute-form-close'); },
            formAction(data){ console.log('absolute-form-submit'); EB.$emit('absolute-form-submit',data); },
        },
        created(){
            EB.$on('absolute-form-notify',this.setNotification)
        },
        beforeDestroy(){
            ['absolute-form-notify'].map(event => EB.$off(event))
        }
    }
</script>
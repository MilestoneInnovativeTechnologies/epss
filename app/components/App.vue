<!--suppress ALL -->
<template>
    <Page actionBarHidden="true" backgroundSpanUnderStatusBar="true" @navigatedTo="navigationBusy = false" @navigatingFrom="navigationBusy = true" @navigatingTo="navigationBusy = true">
        <Drawer>
            <CustomActionBar :title="title" :back="back" :drawer="drawer"></CustomActionBar>
            <AbsoluteLayout class="w-full">
                <MainContent top="0" left="0" class="w-full h-full" v-bind="mainContentBind" v-on="$listeners" style="z-index: 1"><slot></slot></MainContent>
                <AbsoluteFormContainer top="0" left="0" class="w-full h-full transparent" v-if="showAbsoluteForm" v-bind="absoluteFormProps" style="z-index: 2"></AbsoluteFormContainer>
                <NumberPadContainer top="0" left="0" class="w-full h-full transparent" v-if="showNumberPad" v-bind="numberPadProps" style="z-index: 3"></NumberPadContainer>
                <NavigationSpinner top="0" left="0" class="w-full h-full" v-if="navigationBusy" style="z-index: 4"></NavigationSpinner>
            </AbsoluteLayout>
        </Drawer>
    </Page>
</template>

<script>
    import {EventListeners} from "../assets/scripts/mixins/eventlisteners";

    export default {
        name: 'App',
        mixins: [EventListeners],
        props: {
            title: String,
            back: { type: [String,Boolean], default: true },
            drawer: { type: [String,Boolean], default: true },
            action: String,
            scroll: { type: [Boolean,String], default: true },
            width: { type: [String,Number], default: '95%' },
            center: { type: [String,Boolean], default: false },
            actionProps: { type: Object },
            numberPad: { type: [String,Boolean], default: false },
            numberPadProps: { type: [String,Object], default: () => { return {} } },
            form: { type: [String,Boolean], default: false },
            formProps: { type: [Object], default: () => { return {} } },
        },
        data(){ return {
            mainContentProps: ['action','scroll','width','center','actionProps'],
            navigationBusy: false,
        }},
        computed: {
            mainContentBind(){  return _(this.mainContentProps).mapKeys(i => i).mapValues(i => this[i]).value() },
            showNumberPad(){ return (this.numberPad !== 'false' && this.numberPad !== false) },
            showForm(){ return (this.form !== 'false' && this.form !== false) },
        },
        created(){
            EB.$on('number-pad-cancelled',() => this.$emit('numberpad',{ result:false,number:_.toNumber(this.numberPadProps.defaultText) || 0 }));
            EB.$on('number-pad-proceeded',(number) => this.$emit('numberpad',{ result:true,number }));
        },
        methods: {
            listener0(data){ this.numberPad = data; this.ELOn('number-pad-cancelled',() => { this.numberPad = null; this.ELOff('number-pad-cancelled'); }) },
            listener1(form){ this.absoluteForm = form; this.ELOn('absolute-form-close',() => { this.absoluteForm = null; this.ELOff('absolute-form-close'); }) },
        }
    }
</script>
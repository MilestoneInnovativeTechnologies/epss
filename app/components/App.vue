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
        },
        data(){ return {
            events: ['number-pad','absolute-form'],
            mainContentProps: ['action','scroll','width','center','actionProps'],
            navigationBusy: false,
        }},
        computed: {
            mainContentBind(){  return _(this.mainContentProps).mapKeys(i => i).mapValues(i => this[i]).value() },
            absoluteForm(){ return this.$store.state.absoluteForm },
            numberPad(){ return this.$store.state.numberPad },
            showNumberPad(){ return !!(this.numberPad) },
            numberPadProps(){ return this.numberPad },
            showAbsoluteForm(){ return !!(this.absoluteForm) },
            absoluteFormProps(){ return this.absoluteForm }
        },
        methods: {
            listener0(data){ this.$store.state.numberPad = data; this.ELOn('number-pad-cancelled',() => { this.$store.state.numberPad = null; this.ELOff('number-pad-cancelled'); }) },
            listener1(form){ this.$store.state.absoluteForm = form; this.ELOn('absolute-form-close',() => { this.$store.state.absoluteForm = null; this.ELOff('absolute-form-close'); }) },
        }
    }
</script>
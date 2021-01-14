<template>
    <Page actionBarHidden="true" backgroundSpanUnderStatusBar="true" @navigatedTo="navigationBusy = false" @navigatingFrom="navigationBusy = true" @navigatingTo="navigationBusy = true">
        <Drawer>
            <CustomActionBar :title="title" :back="back" :drawer="drawer" />
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
    import { mapMutations } from 'vuex'
    import {set_state_data} from "../assets/scripts/vuex/mutation-types";

    export default {
        name: 'App',
        mixins: [EventListeners],
        props: {
            title: String,
            back: { type: [String,Boolean], default: true },
            drawer: { type: [String,Boolean], default: true },
            action: null,
            scroll: { type: [Boolean,String], default: true },
            width: { type: [String,Number], default: '95%' },
            center: { type: [String,Boolean], default: false },
            actionProps: null,
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
            ...mapMutations([set_state_data]),
            listener0(data){ this.$store.state.numberPad = data; this.ELOn('number-pad-cancelled',() => { this.$store.state.numberPad = null; this.ELOff('number-pad-cancelled'); }) },
            listener1(absoluteForm){ this[set_state_data]({ absoluteForm }); this.ELOn('absolute-form-close',() => { this[set_state_data]({ absoluteForm:null }); this.ELOff('absolute-form-close'); }) },
        }
    }
</script>

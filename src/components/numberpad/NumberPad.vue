<template>
    <GridLayout columns="324" rows="auto,auto,auto,auto" backgroundColor="#FFFFFF">
        <TextTitleSub row="0" class="p-y-15 bcp text-center" style="color: #FFFFFF" :text="title" />
        <TextTitle row="1" class="text-center fs24 c-bg-white bordercp p-y-15" style="border-width: 2" :text="number" />
        <GridLayout row="2" rows="auto,auto" columns="3*,*" width="324" class="bordercp" style="border-width: 2">
            <WrapLayout row="0" col="0">
                <NumberPadKey v-for="n in 9" :text="n" :key="'cal-key-'+n" @tap.native="app(n)" @doubleTap.native="app(n+''+n)" />
            </WrapLayout>
            <WrapLayout row="0" col="1">
                <NumberPadKey icon="backspace" @tap.native="bks()" />
                <NumberPadKey icon="clear_all" @tap.native="clr()" />
                <NumberPadKey icon="exposure_plus_1" @tap.native="add(1)" @doubleTap.native="add(2)" />
            </WrapLayout>
            <WrapLayout row="1" col="0" colSpan="2">
                <NumberPadKey icon="exposure" @tap.native="sign()" />
                <NumberPadKey text="." @tap.native="dec()" />
                <NumberPadKey text="0" width="156" @tap.native="app(0)" />
            </WrapLayout>
        </GridLayout>
        <StackLayout row="3" orientation="horizontal" class="bcg01">
            <AppButton width="40%" height="70" class="c-white" @tap.native="cancel">{{ cancelButtonText }}</AppButton>
            <AppButton width="60%" height="70" class="c-white" @tap.native="proceed">{{ okButtonText }}</AppButton>
        </StackLayout>
    </GridLayout>
</template>

<script>
    export default {
        name: "NumberPad",
        props: {
            title: { type: String, default: 'Number Pad' },
            defaultText: { type: Number, default: 0 },
            okButtonText: { type: String, default: 'Proceed' },
            cancelButtonText: { type: String, default: 'Cancel' },
        },
        data(){ return {
            number: this.defaultText,
            decimal: false, clear: true
        } },
        methods: {
            setNum(n){ this.$set(this,'number',n.toString()); if(this.clear) this.clear = false; },
            app(n){ clickTune.play(); let C = this.clear ? '' : this.number; this.setNum(C + (this.decimal ? '.' : '') + n); if(this.decimal) this.decimal = false;  },
            bks(){ clickTune.play(); this.setNum(this.number.toString().substr(0,this.number.toString().length-1)) },
            sign(){ clickTune.play(); this.setNum(_.toNumber(this.number)*(-1)) },
            clr(){ clickTune.play(); this.setNum(0) },
            add(n){ clickTune.play(); this.setNum(_.toNumber(this.number) + _.toNumber(n)) },
            dec(){ clickTune.play(); this.decimal = (_.toSafeInteger(this.number) === _.toNumber(this.number)) },
            cancel(){ clickTune.play(); EB.$emit('number-pad-cancelled') },
            proceed(){ clickTune.play(); EB.$emit('number-pad-proceeded',_.toNumber(this.number)) },
        }
    }
</script>

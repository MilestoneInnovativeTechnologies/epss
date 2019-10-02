<template>
    <GridLayout columns="*" rows="auto,auto,auto,auto" width="420" backgroundColor="#FFFFFF">
        <TextTitleSub row="0" class="p-y-15 bcp text-center" style="color: #FFFFFF">{{ title }}</TextTitleSub>
        <TextTitle row="1" class="text-center fs24 c-bg-white bordercp p-y-15" style="border-width: 1" :key="number">{{ number }}</TextTitle>
        <GridLayout row="2" rows="auto,auto" columns="3*,*" width="420" class="bordercp" style="border-width: 2">
            <WrapLayout row="0" col="0">
                <NumberPadKey v-for="n in 9" :text="n" :key="'cal-key-'+n" @tap.native="app(n)" @doubleTap.native="app(n+''+n)"></NumberPadKey>
            </WrapLayout>
            <WrapLayout row="0" col="1">
                <NumberPadIcon text="backspace" @tap.native="bks()"></NumberPadIcon>
                <NumberPadIcon text="exposure" @tap.native="sign()"></NumberPadIcon>
                <NumberPadIcon text="exposure_plus_1" @tap.native="add(1)" @doubleTap.native="add(2)"></NumberPadIcon>
            </WrapLayout>
            <WrapLayout row="1" col="0" colSpan="2">
                <NumberPadIcon text="delete_sweep" @tap.native="clr()"></NumberPadIcon>
                <NumberPadKey text="." @tap.native="dec()"></NumberPadKey>
                <NumberPadKey text="0" width="204" @tap.native="app(0)"></NumberPadKey>
            </WrapLayout>
        </GridLayout>
        <StackLayout row="3" orientation="horizontal" class="bcg01">
            <AppButton width="40%" height="70" class="c-white" @tap.native="cancel()">{{ cancelButtonText }}</AppButton>
            <AppButton width="60%" height="70" class="c-white" @tap.native="proceed()">{{ okButtonText }}</AppButton>
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
            decimal: false
        } },
        methods: {
            setNum(n){ this.number = n.toString() },
            app(n){ this.setNum(this.number + (this.decimal ? '.' : '') + n); if(this.decimal) this.decimal = false;  },
            bks(){ this.setNum(this.number.toString().substr(0,this.number.toString().length-1)) },
            sign(){ this.setNum(_.toNumber(this.number)*(-1)) },
            clr(){ this.setNum(0) },
            add(n){ this.setNum(_.toNumber(this.number) + _.toNumber(n)) },
            dec(){ this.decimal = (_.toSafeInteger(this.number) === _.toNumber(this.number)) },
            cancel(){ EB.$emit('number-pad-cancelled') },
            proceed(){ EB.$emit('number-pad-proceeded',_.toNumber(this.number)) },
        }
    }
</script>
export default {
    props: ['text'],
    computed: {
        mText(){
            if(!_.isNil(this.text)) return this.text;
            if(!_.isEmpty(this.$slots.default) && this.$slots.default[0])
                return this.$slots.default[0];
            return ''
        },
    }
}
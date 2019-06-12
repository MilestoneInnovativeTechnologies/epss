export default {
    props: ['text'],
    computed: {
        mText(){ return this.text || _.get(this.$slots.default,'0.text',' ') },
    }
}
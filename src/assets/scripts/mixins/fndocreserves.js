export const FnDocReserve = {
    data(){ return {
        FDR_ready: false,
    } },
    computed: {
        FDR_Doc(){
            return this.$store.getters["Reserves/get"](
                this.store || this.$store.state.default_store,
                this.fycode || this.$store.state.default_fycode,
                this.fncode
            )
        },
    },
    created(){
        if(this.FDR_Doc) this.FDR_ready = true;
    }
};
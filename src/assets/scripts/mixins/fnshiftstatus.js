export const FnShiftStatus = {
    data(){ return {
        SS_ready: true,
    } },
    computed: {
        SS_ShiftActive(){ return this.$store.getters["FN/shiftActive"](this.fncode) },
        SS_ShiftDocNo(){ return this.$store.getters["Shift/docno"] },
    },
    created(){
        if(this.SS_ShiftActive && !this.SS_ShiftDocNo) this.SS_ready = false;
        if(!this.SS_ready) alert('Shift Required!!');
    }
};
export const FiscalYearCheck = {
    data(){ return { FYC_msg1: 'Date is not in the range of fiscal year!!' } },
    methods: {
        FYC_Okey(iDate){
            let date = iDate || this.date;
            let eStatus = moment(this.FYC_endDate).diff(moment(date)) >= 0;
            let sStatus = moment(date).diff(moment(this.FYC_startDate)) >= 0;
            return (eStatus && sStatus)
        }
    },
    computed: {
        FYC_FiscalCode(){ return this.fycode || this.$store.state.default_fycode },
        FYC_FiscalObj(){ return this.$store.state.Fiscal.list.find(({ code }) => code == this.FYC_FiscalCode) },
        FYC_startDate(){ return _.get(this.FYC_FiscalObj,'start_date',moment().format('YYYY-MM-DD 00:00:00')) },
        FYC_endDate(){ return _.get(this.FYC_FiscalObj,'end_date',moment().format('YYYY-MM-DD 00:00:00')).toString().replace('00:00:00','23:59:59') },
    },
};
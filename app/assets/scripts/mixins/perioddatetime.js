export const PeriodDateTime = {
    computed: {
        startOfDay() { return moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'); },
        startOfWeek() { return moment().startOf('week').format('YYYY-MM-DD HH:mm:ss'); },
        startOfMonth() { return moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'); },
    }
};
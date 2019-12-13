<template>
    <AppList :source="customers" :layout="listLayout" :cast="listCast" :detail="listDetail" :links="listLinks"  :title="title || 'Customers'" :limit="limit || 10"></AppList>
</template>

<script>
    export default {
        name: "CustomerList",
        props: ['customers','layout','cast','detail','links','title','limit'],
        data(){ return {
            defaultLayout: { Name:'name',Phone:'phone',Email:'email',Code:'code','Out Standing':'outstanding',Overdue:'overdue' },
            defaultCast: { outstanding:'amount',overdue:'amount' },
            defaultDetail: 'customer/CustomerDetail',
            defaultLinks: {  },
        }},
        computed: {
            listLayout(){ return this.layout || this.defaultLayout },
            listCast(){ return this.cast || this.defaultCast },
            listDetail(){ return this.detail || this.defaultDetail },
            listLinks(){  },
        }
    }
</script>
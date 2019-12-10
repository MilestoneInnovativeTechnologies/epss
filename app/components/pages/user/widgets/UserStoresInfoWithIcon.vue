<template>
    <InfoWithIcon heading="Stores" icon="store_mall_directory" :contents="stores"></InfoWithIcon>
</template>

<script>
    import {user_assigned_area_customers} from "../../../../assets/scripts/queries";

    export default {
        name: "UserStoresInfoWithIcon",
        props: ['user'],
        computed: {
            stores(){ return _.map(this.list,'name') },
            list(){ return this.$store.state['Stores'].list },
        },
        created(){
            if(this.user && (!this.list || !this.list.length)) this.$store.dispatch('Stores/_stock',{ query:sql.format(user_assigned_area_customers, this.user) })
        }
    }
</script>
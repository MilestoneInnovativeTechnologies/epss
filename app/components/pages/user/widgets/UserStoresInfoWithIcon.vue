<template>
    <InfoWithIcon heading="Stores" icon="store_mall_directory" :contents="stores"></InfoWithIcon>
</template>

<script>
    import {login_user_assigned_stores} from "../../../../assets/scripts/queries";

    export default {
        name: "UserStoresInfoWithIcon",
        props: ['user'],
        computed: {
            stores(){ return _.map(this.list,'name') },
            list(){ return this.$store.state['Stores'].list },
        },
        created(){
            if(this.user && (!this.list || !this.list.length)) this.$store.dispatch('Stores/_stockIfNot',{ query:sql.format(login_user_assigned_stores) })
        }
    }
</script>
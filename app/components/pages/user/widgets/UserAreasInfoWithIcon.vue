<template>
    <InfoWithIcon heading="Areas" icon="map" :contents="areas"></InfoWithIcon>
</template>

<script>
    import {login_user_assigned_areas} from "../../../../assets/scripts/queries";

    export default {
        name: "UserAreasInfoWithIcon",
        props: ['user'],
        computed: {
            areas(){ return _.map(this.list,'name') },
            list(){ return this.$store.state['Areas'].list }
        },
        created(){
            if(this.user && (!this.list || !this.list.length)) this.$store.dispatch('Areas/_stock',{ query:login_user_assigned_areas })
        }
    }
</script>
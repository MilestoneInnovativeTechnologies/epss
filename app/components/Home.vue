<template>
    <App :title="name">
        <UserStoresInfoWithIcon width="90%" :user="id"></UserStoresInfoWithIcon>
        <UserAreasInfoWithIcon width="90%" :user="id"></UserAreasInfoWithIcon>
        <HomeWidgets width="90%" :key="'hw-'+uKey"></HomeWidgets>
        <HomeMenu class="m-t-20" :key="'hm-'+uKey"></HomeMenu>
        <AppButton @tap.native="userLogout" class="m-t-15 c-white">LOGOUT</AppButton>
    </App>
</template>

<script>
    import {mapState} from 'vuex'
    import {logoutMixin} from "../assets/scripts/mixins/logout";
    import {Login} from "../assets/scripts/navigations";

    export default {
        name: "Home",
        mixins: [logoutMixin],
        data(){ return { uKey:0 } },
        computed: mapState('User', ['id','name']),
        mounted: function () {
            this.$nextTick(() => this.id ? this.uKey++ : this.$navigateTo(Login,{ backstackVisible:false }))
        }
    }
</script>
<template>
    <App :title="name">
        <UserStoresInfoWithIcon width="90%" :user="id"></UserStoresInfoWithIcon>
        <UserAreasInfoWithIcon width="90%" :user="id"></UserAreasInfoWithIcon>
        <HomeWidgets width="90%"></HomeWidgets>
        <HomeMenu class="m-t-20"></HomeMenu>
        <AppButton @tap.native="userLogout" class="m-t-15 c-white">LOGOUT</AppButton>
    </App>
</template>

<script>
    import {mapState, mapGetters, mapActions} from 'vuex'
    import {logoutMixin} from "../assets/scripts/mixins/logout";
    import {Login} from "../assets/scripts/navigations";

    export default {
        name: "Home",
        mixins: [logoutMixin],
        computed: mapState('User', ['id','name']),
        mounted: function () {
            this.$nextTick(() => this.id ? null : this.$navigateTo(Login,{ backstackVisible:false }))
        }
    }
</script>
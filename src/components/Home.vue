<template>
    <App :title="name">
        <UserStoresInfoWithIcon width="90%" :user="id" />
        <UserAreasInfoWithIcon width="90%" :user="id" />
        <HomeWidgets width="90%" :key="'hw-'+uKey" />
        <HomeMenu class="m-t-20" :key="'hm-'+uKey" />
        <AppButton @tap.native="userLogout" class="m-t-15 c-white">LOGOUT</AppButton>
    </App>
</template>

<script>
    import {mapState} from 'vuex'
    import {logoutMixin} from "../assets/scripts/mixins/logout";
    import { Login } from "../assets/scripts/navigations";
    import {AccountKeyDefaults} from "../assets/scripts/mixins/accountkeydefaults";

    export default {
        name: "Home",
        mixins: [logoutMixin,AccountKeyDefaults],
        data(){ return { uKey:0 } },
        computed: {
            ...mapState('User', ['id','name']),
            store(){ return this.$store }
        },
        mounted: function () {
            if(!this.id) return this.$navigateTo(Login.default,{ backStackVisible:false });
            this.ACCKDs_requestDefaults()
            this.uKey++;
            //this.$nextTick(() => this.id ? this.uKey++ : this.$navigateTo(Login.default,{ backStackVisible:false }))
        }
    }
</script>

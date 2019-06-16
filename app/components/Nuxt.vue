<!--suppress ALL -->
<template>
    <App title="NuxT">
        <Label v-for="dum in dummy" :text="dum" />
        <UserStores width="90%"></UserStores>
        <Button @tap="tapaa" text="Tippaaaa" />
    </App>
</template>

<script>
    import { mapGetters,mapState,mapActions,mapMutations } from 'vuex'
    export default {
        name: "Nuxt",
        computed: {
            ...mapState('Stores',['dummy'])
        },
        methods: {
            ...mapMutations('Stores',['asss']),
            tapaa(){
                this.asss();
            }
        }
    }
</script>
<!--suppress ALL -->
<template>
    <App title="NuxT">
        <UserStores width="90%"></UserStores>
        <Button @tap="cstr" text="Create & add store" />
        <Button @tap="clear" text="clear" />
        <StackLayout orientation="horizontal">
            <StackLayout width="50%">
                <Label v-for="dum in as" :text="dum" />
            </StackLayout>
            <StackLayout width="50%">
                <Label v-for="dum in ms" :text="dum" />
            </StackLayout>
        </StackLayout>
    </App>
</template>

<script>
    import {mutate_sync_data} from "../assets/scripts/vuex/mutation-types";
    import { mapGetters,mapState,mapActions,mapMutations } from 'vuex'
    export default {
        name: "Nuxt",
        computed: {
            ...mapGetters('Stores',['as','ms','_dataById']),
            did(){ return this._dataById('stores') }
        },
        methods: {
            ...mapMutations('Stores', [mutate_sync_data,'clear']),
        }
    }
</script>
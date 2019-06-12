<!--suppress ALL -->
<template>
    <App title="User Name">
        <InfoWithIcon width="90%" heading="Stores" icon="store_mall_directory" :contents="['Store 1 Name','Store 2 Name']"></InfoWithIcon>
        <InfoWithIcon width="90%" heading="Areas" icon="map" :contents="['Area 1 Name','Area 2 Name']"></InfoWithIcon>
        <template v-for="(items,caption,sidx) in menus">
            <TextTitleSub class="m-t-12 m-b-8 m-l-2">{{ caption }}</TextTitleSub>
            <GridMenuRow :menus="items"></GridMenuRow>
        </template>
    </App>
</template>

<script>
    import { mapGetters,mapState } from 'vuex'
    export default {
        name: "Home",
        computed: {
            ...mapGetters('Menu', ['menus']),
        },
        created() {
            console.log('Home created');
            DB.get('sqlite_master',null,function () {
                _.forEach(this.result,function (ob) {
                    DB.get(ob.tbl_name,null,function () {
                        console.log(ob.tbl_name+' has '+this.result.length+' records');
                    })
                })
            })
        }
    }
</script>
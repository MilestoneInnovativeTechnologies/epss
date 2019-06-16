<!--suppress ALL -->
<template>
    <Page>
        <ActionBar title="ePlus Smart Sale"></ActionBar>
        <ScrollView>
            <GridLayout width="100%" rows="auto,*,50">
                <Organization row="0"></Organization>
                <Login row="1"></Login>
                <Label row="2" textWrap="true" class="t-12 fsi font-italic text-center" style="width: 90%;" :text="pick" />
            </GridLayout>
        </ScrollView>
    </Page>
</template>

<script>
    import { mapGetters,mapState } from 'vuex';
    export default {
        name: 'Land',
        computed: {
            ...mapGetters('Log', ['pick']),
        },
    }
</script>
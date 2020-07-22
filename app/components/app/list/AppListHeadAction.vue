<template>
    <StackLayout style="vertical-align: middle;" size="20" class="cp">
        <FontIcon v-if="action === 'remove' && items" @tap.native="$emit('list-action',{ action:'removeAll' })" name="clear" />
        <AppListHeadActionSelect v-else-if="action === 'select'"  @tap.native="$emit('list-action',{ action:'all' })" :status="status" />
        <TextBold v-else> </TextBold>
    </StackLayout>
</template>

<script>
    export default {
        name: "AppListHeadAction",
        props: ['action','collection','items'],
        computed: {
            status(){ let collLength = this.collection.length, itemsLength = _.toSafeInteger(this.items); return (collLength) ? ((collLength === itemsLength) ? 1 : 2) : 0 }
        }
    }
</script>

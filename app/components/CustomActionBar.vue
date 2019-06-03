<!--suppress ALL -->
<template>
    <ActionBar>
        <GridLayout width="100%" columns="auto">
            <Label style="" class="fsb fs22" :text="title" col="0"/>
        </GridLayout>
    </ActionBar>
</template>

<script>
    export default {
        name: 'CustomActionBar',
        props: ['title']
    }
</script>

<style scoped></style>

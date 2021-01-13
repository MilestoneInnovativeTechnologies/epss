<template>
    <GridLayout rows="auto" columns="*,auto">
        <Label text="" row="0" col="0" />
        <StackLayout row="0" col="1" orientation="horizontal" @tap="$emit('resync')"><FontIcon name="cached" class="cp" /><Label class="m-t-4 m-l-4 cp" :text="label || 'Re sync'" /></StackLayout>
    </GridLayout>
</template>

<script>
export default {
    name: "ReSyncButton",
    props: ['label']
}
</script>
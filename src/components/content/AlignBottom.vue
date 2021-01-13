<template>
    <GridLayout rows="*,auto" columns="*">
        <StackLayout row="0" col="0"></StackLayout>
        <StackLayout row="1" col="0"><slot></slot></StackLayout>
    </GridLayout>
</template>

<script>
    export default {
        name: "AlignBottom"
    }
</script>
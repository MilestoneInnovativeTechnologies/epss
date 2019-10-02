<template>
    <GridLayout rows="*,auto,*">
        <StackLayout row="0"></StackLayout>
        <StackLayout row="1"><slot></slot></StackLayout>
        <StackLayout row="2"></StackLayout>
    </GridLayout>
</template>

<script>
    export default {
        name: "HorizontallyMiddle"
    }
</script>
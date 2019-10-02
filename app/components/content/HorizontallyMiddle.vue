<template>
    <GridLayout columns="*,auto,*">
        <StackLayout col="0"></StackLayout>
        <StackLayout col="1"><slot></slot></StackLayout>
        <StackLayout col="2"></StackLayout>
    </GridLayout>
</template>

<script>
    export default {
        name: "HorizontallyMiddle"
    }
</script>
<template>
    <GridLayout rows="*,auto,*" columns="*,auto,*">
        <StackLayout row="0" col="0" colSpan="3"></StackLayout>
        <StackLayout row="1" col="0"></StackLayout>
        <StackLayout row="1" col="1"><slot></slot></StackLayout>
        <StackLayout row="1" col="2"></StackLayout>
        <StackLayout row="2" col="0" colSpan="3"></StackLayout>
    </GridLayout>
</template>

<script>
    export default {
        name: "AlignMiddle"
    }
</script>
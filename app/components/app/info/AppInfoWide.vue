<template>
    <GridLayout rows="auto" columns="2*,*">
        <TextBold row="0" col="0" class="text-left"><slot></slot></TextBold>
        <TextHeadingRowSub row="0" col="1" class="text-right">{{ title }}</TextHeadingRowSub>
    </GridLayout>
</template>

<script>
    export default {
        name: "AppInfoWide",
        props: {
            title: { default:'' },
        }
    }
</script>
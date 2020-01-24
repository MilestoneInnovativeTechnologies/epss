<template>
    <StackLayout>
        <TextTitleSub class="m-b-8 m-l-2">{{ title }}</TextTitleSub>
        <GridMenuSectionItems :items="items" :height="height" :space="space"></GridMenuSectionItems>
    </StackLayout>
</template>

<script>
    export default {
        name: "GridMenuSection",
        props: ['title','items','height','space']
    }
</script>
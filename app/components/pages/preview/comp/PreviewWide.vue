<template>
    <StackLayout>
        <PreviewWideItem v-for="(text,title,no) in items" :title="title" :key="['pwi',unique,no].join('-')" class="m-b-5">{{ text }}</PreviewWideItem>
    </StackLayout>
</template>

<script>
    export default {
        name: "PreviewWide",
        props: ['items'],
        computed: {
            unique(){ return new Date().getTime() },
        }
    }
</script>
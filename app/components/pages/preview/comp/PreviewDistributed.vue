<template>
    <WrapLayout>
        <PreviewDistributedItem v-for="(text,title,no) in items" :title="title" :key="['pdi',unique,no].join('-')" class="m-b-10" width="50%" :right="no%2">{{ text }}</PreviewDistributedItem>
    </WrapLayout>
</template>

<script>
    export default {
        name: "PreviewDistributed",
        props: ['items'],
        computed: {
            unique(){ return new Date().getTime() },
        }
    }
</script>
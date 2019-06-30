<template>
    <StackLayout width="100%" :height="height || 1" class="m-y-4" backgroundColor="#000000"></StackLayout>
</template>

<script>
    export default {
        name: "PreviewLine",
        props: ['height']
    }
</script>
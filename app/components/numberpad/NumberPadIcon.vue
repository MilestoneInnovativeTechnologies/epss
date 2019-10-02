<template>
    <Label height="100" width="100" class="bcp m-2 p-t-30 text-center font-weight-bold c-white fs32 mi" :text="text | fonticon" />
</template>

<script>
    export default {
        name: "NumberPadIcon",
        props: ['text']
    }
</script>
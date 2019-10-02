<template>
    <Label height="100" width="100" class="bcp m-2 p-t-25 font-weight-bold text-center fsb c-white fs32">{{ text }}</Label>
</template>

<script>
    export default {
        name: "NumberPadKey",
        props: ['text']
    }
</script>
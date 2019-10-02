<template>
    <HorizontallyMiddle>
        <NumberPad :title="title" :defaultText="defaultText" :okButtonText="okButtonText" :cancelButtonText="cancelButtonText"></NumberPad>
    </HorizontallyMiddle>
</template>

<script>
    export default {
        name: "NumberPadContainer",
        props: {
            title: { type: String, default: 'Number Pad' },
            defaultText: { type: Number, default: 0 },
            okButtonText: { type: String, default: 'Proceed' },
            cancelButtonText: { type: String, default: 'Cancel' },
        }
    }
</script>
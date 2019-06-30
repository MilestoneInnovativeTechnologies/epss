<template>
    <StackLayout>
        <!--suppress HtmlDeprecatedTag -->
        <Image v-if="image" :src="image" height="96" stretch="aspectFit"></Image>
        <TextTitleSub style="width: 100%; text-align: center">{{ print_head_text1 }}</TextTitleSub>
        <TextItalic style="width: 100%; text-align: center; color: #000000">{{ print_head_text2 }}</TextItalic>
    </StackLayout>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: "PreviewHead",
        computed: {
            ...mapState('Organization',['image','print_head_text1','print_head_text2'])
        }
    }
</script>
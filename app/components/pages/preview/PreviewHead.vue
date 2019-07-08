<template>
    <StackLayout>
        <!--suppress HtmlDeprecatedTag -->
        <Image v-if="image" :src="image" height="96" stretch="aspectFit"></Image>
        <TextTitleSub style="width: 100%; text-align: center">{{ print_head_line1 }}</TextTitleSub>
        <TextItalic style="width: 100%; text-align: center; color: #000000">{{ print_head_line2 }}</TextItalic>
    </StackLayout>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: "PreviewHead",
        computed: {
            ...mapState('App',['image','print_head_line1','print_head_line2'])
        }
    }
</script>
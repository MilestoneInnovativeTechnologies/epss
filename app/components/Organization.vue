<!--suppress ALL -->
<template>
    <StackLayout>
        <GridLayout v-show="!!name" width="100%" rows="50,6,auto,6">
            <StackLayout row="0"></StackLayout>
            <StackLayout row="1" class=""
                         style="background: linear-gradient(to top, #E1E1E1, #FFFFFF); width: 100%;"></StackLayout>
            <StackLayout row="2" class="p-y-20">
                <Image :src="image" height="128"/>
                <TextTitle :text="name" class="text-center cp w-full"></TextTitle>
                <TextItalic :text="brief" textWrap="true" class="font-weight-bold text-center t-12" width="70%"></TextItalic>
            </StackLayout>
            <StackLayout row="3" class="" style="background: linear-gradient(to bottom, #E1E1E1, #FFFFFF); width: 100%;"></StackLayout>
        </GridLayout>
    </StackLayout>
</template>

<script>
    import {mapState} from 'vuex';
    import TextTitle from "./typography/TextTitle";

    export default {
        name: 'Organization',
        components: {TextTitle},
        computed: {
            ...mapState('App', ['image', 'name', 'brief']),
        }
    }
</script>

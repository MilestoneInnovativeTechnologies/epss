<!--suppress ALL -->
<template>
    <StackLayout>
        <GridLayout v-show="!!name" width="100%" rows="50,6,auto,6">
            <StackLayout row="0"></StackLayout>
            <StackLayout row="1" class=""
                         style="background: linear-gradient(to top, #E1E1E1, #FFFFFF); width: 100%;"></StackLayout>
            <StackLayout row="2" class="p-y-20">
                <Image :src="image" height="128"/>
                <Label :text="name" class="text-center cp m-y-15 fsb fs22" style="width: 100%"/>
                <Label :text="brief" textWrap="true" class="font-weight-bold text-center font-italic fsi t-12"
                       style="width: 70%"/>
            </StackLayout>
            <StackLayout row="3" class=""
                         style="background: linear-gradient(to bottom, #E1E1E1, #FFFFFF); width: 100%;"></StackLayout>
        </GridLayout>
    </StackLayout>
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        name: 'Organization',
        data() {
            return {}
        },
        computed: {
            ...mapState('Organization', ['image', 'name', 'brief', 'uuid']),
        }
    }
</script>

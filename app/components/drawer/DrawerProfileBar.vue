<template>
    <GridLayout columns="*" rows="auto" backgroundColor="#FFFFFF" class="p-t-20">
        <DockLayout row="0" width="90%" stretchLastChild="true">
            <Label :text="'account_circle' | fonticon" class="mi cp" dock="left" style="font-size: 60" width="80" />
            <GridLayout verticalAlignment="center" rows="auto,auto" columns="*" class="text-left">
                <TextBold row="0" :text="name" />
                <TextHighlight row="1" :text="email" />
            </GridLayout>
        </DockLayout>
    </GridLayout>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: "DrawerProfileBar",
        computed: mapState('User',['name','email']),
    }
</script>

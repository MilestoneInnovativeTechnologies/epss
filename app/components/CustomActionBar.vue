<!--suppress ALL -->
<template>
    <ActionBar title="">
        <!--            <NavigationButton icon="res://back" @tap="hum" />-->
        <NavigationButton text="Go back" android.systemIcon="ic_menu_back" @tap="$navigateBack" />
        <TextHeading style="width: 70%; text-align: center" >{{ title }}</TextHeading>
        <ActionItem @tap="hum">
            <FontIcon size="35" class="c-black">menu</FontIcon>
        </ActionItem>
    </ActionBar>
</template>

<script>
    export default {
        name: 'CustomActionBar',
        props: ['title'],
        methods: {
            hum() {
                console.log('hum');
            }
        }
    }
</script>

<style scoped></style>

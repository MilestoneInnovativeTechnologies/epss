<template>
    <Page>
        <ActionBar title="My App">
            <NavigationButton text="Go back" android.systemIcon="ic_menu_back" @tap="$navigateBack" />
        </ActionBar>
        <StackLayout>
            <Button text="BACK" width="50%" @tap="$navigateBack" class="btn btn-primary btn-active bcp"/>
        </StackLayout>
    </Page>
</template>

<script>
    export default {
        name: "Home",
        mounted() {
            log('Home Mounted');
        }
    }
</script>

<style scoped>

</style>
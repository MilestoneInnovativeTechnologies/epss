<template>
    <GridLayout rows="*" columns="*" style="background-color: rgba(255,255,255,0.6)">
        <ActivityIndicator :busy="true" verticalAlignment="center" horizontalAlignment="center"></ActivityIndicator>
    </GridLayout>
</template>

<script>
    export default {
        name: "NavigationSpinner",
    }
</script>
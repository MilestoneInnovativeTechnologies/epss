<template>
    <ScrollView>
        <WrapLayout>
            <WSSaleItem v-for="item in items" :item="item" :key="'list-product-'+item.id" class="m-r-10 m-b-10"></WSSaleItem>
        </WrapLayout>
    </ScrollView>
</template>

<script>
    export default {
        name: "WSSaleItems",
        props: ['items'],
    }
</script>
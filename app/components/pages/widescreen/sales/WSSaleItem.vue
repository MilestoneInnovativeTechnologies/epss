<template>
    <StackLayout width="220" height="300" style="border-top-width: 1" class="bordercp p-t-2" @tap="addItem(item)">
        <WSSaleItemImage :item="item" width="220" height="220"></WSSaleItemImage>
        <FlexboxLayout height="80" class="bcp">
            <Label :text="name" class="c-white fs20 fsb p-5" width="160" textWrap="true"></Label>
            <StackLayout verticalAlignment="middle" class="bcp m-l-5 bordercp" style="border-width: 2; background-color: #FFFFFF">
                <Label width="60" :text="rate" class="fsb fs20 text-center cp c-bg-white"></Label>
            </StackLayout>
        </FlexboxLayout>
    </StackLayout>
</template>

<script>
    export default {
        name: "WSSaleItem",
        props: ['item'],
        computed: {
            name(){ return this.item.narration },
            rate(){ return __.rate(this.item.price) },
        },
        methods: {
            addItem(item){ EB.$emit('wssale-item-selected',this.item) }
        }
    }
</script>
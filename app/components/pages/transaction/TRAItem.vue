<template>
    <StackLayout :width="width" :height="height" style="border-width: 2" class="bordercg01 p-t-2" @tap="addItem(item)">
        <TRAItemImage :item="item" :width="width" :height="width"></TRAItemImage>
        <FlexboxLayout :height="height-width" class="bcp">
            <Label :text="name" class="c-white fs10 fsb p-5" :width="width - (height-width) - 5" textWrap="true"></Label>
            <StackLayout verticalAlignment="middle" class="bcp m-l-5 bordercp" style="border-width: 2; background-color: #FFFFFF">
                <Label :width="height-width" :text="rate" class="fsb fs14 text-center cp c-bg-white"></Label>
            </StackLayout>
        </FlexboxLayout>
    </StackLayout>
</template>

<script>
    export default {
        name: "TRAItem",
        props: ['item','width','height'],
        computed: {
            name(){ return this.item.narration },
            rate(){ return __.rate(this.item.price) },
        },
        methods: {
            addItem(item){ EB.$emit('tra-item-selected',this.item) }
        }
    }
</script>
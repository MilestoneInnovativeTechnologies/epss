<template>
    <GridLayout rows="auto" columns="*,*,*,*" class="m-0 p-0">
        <StackLayout @tap="quantity" row="0" col="0" borderRadius="5" class="bcp font-weight-bold text-center c-white m-x-2">
            <FontIcon class="m-t-4" name="add_shopping_cart" />
            <TextBold class="c-white fs10" style="color: #FFFFFF" text="Quantity" />
        </StackLayout>
        <StackLayout @tap="discount" row="0" col="1" borderRadius="5" class="bcp font-weight-bold text-center c-white m-x-2">
            <FontIcon class="m-t-4" name="thumb_up" />
            <TextBold class="c-white fs10" style="color: #FFFFFF" text="Discount" />
        </StackLayout>
        <StackLayout @tap="rate" row="0" col="2" borderRadius="5" class="bcp font-weight-bold text-center c-white m-x-2">
            <FontIcon class="m-t-4" name="cached" />
            <TextBold class="c-white fs10" style="color: #FFFFFF" text="Rate" />
        </StackLayout>
        <StackLayout @tap="remove" row="0" col="3" borderRadius="5" class="bcp font-weight-bold text-center c-white m-x-2">
            <FontIcon class="m-t-4" name="delete" />
            <TextBold class="c-white fs10" style="color: #FFFFFF" text="Remove" />
        </StackLayout>
    </GridLayout>
</template>

<script>
    import {EventListeners} from "../../../assets/scripts/mixins/eventlisteners";

    const actions = {
        'edit-quantity': ['Change Quantity', 'add_shopping_cart'],
        'edit-discount': ['Change Discount', 'edit'],
        'edit-rate': ['Change Rate', 'attach-money'],
        'delete': ['Remove Item', 'delete'],
    };

    export default {
        name: "TRAItemActions",
        mixins: [EventListeners],
        props: ['item'],
        data(){ return {
            action: null,
        } },
        methods: {
            quantity(){ this.action = 'quantity'; this.openPad('Quantity',this.item.quantity) },
            rate(){ this.action = 'rate'; this.openPad('Rate',this.item.rate) },
            discount(){ this.action = 'discount'; this.openPad('Discount',this.item.discount) },
            remove(){ this.action = 'remove'; this.updateData(null) },
            openPad(title,defaultText){
                clickTune.play();
                this.ELEmit('number-pad',{ title,defaultText,okButtonText:'Update '+title });
                this.ELOn('number-pad-proceeded',this.updateData);
                this.ELOn('number-pad-cancelled',this.closePad)
            },
            updateData(text){
                clickTune.play();
                this.$emit('update',{ key:this.action,item:this.item,value:text });
                this.closePad();
            },
            closePad(){
                this.ELEmit('number-pad',false);
                this.ELOff('number-pad-proceeded');
                this.ELOff('number-pad-cancelled');
            }
        }
    }
</script>

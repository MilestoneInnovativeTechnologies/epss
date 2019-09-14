<template>
    <GridLayout rows="auto" columns="*,*,*,*">
        <StackLayout @tap="$emit('edit','quantity')" row="0" col="0" borderRadius="5" class="bcp font-weight-bold text-center c-white fs18 m-r-5" height="80">
            <FontIcon class="m-t-12">edit</FontIcon>
            <TextBold class="c-white" style="color: #FFFFFF">Quantity</TextBold>
        </StackLayout>
        <StackLayout @tap="$emit('edit','discount')" row="0" col="1" borderRadius="5" class="bcp font-weight-bold text-center c-white fs18 m-r-5" height="80">
            <FontIcon class="m-t-12">edit</FontIcon>
            <TextBold class="c-white" style="color: #FFFFFF">Discount</TextBold>
        </StackLayout>
        <StackLayout @tap="$emit('edit','rate')" row="0" col="2" borderRadius="5" class="bcp font-weight-bold text-center c-white fs18 m-r-5" height="80">
            <FontIcon class="m-t-12">edit</FontIcon>
            <TextBold class="c-white" style="color: #FFFFFF">Rate</TextBold>
        </StackLayout>
        <StackLayout @tap="$emit('delete')" row="0" col="3" borderRadius="5" class="bcp font-weight-bold text-center c-white fs18" height="80">
            <FontIcon class="m-t-12">delete</FontIcon>
            <TextBold class="c-white" style="color: #FFFFFF">Remove</TextBold>
        </StackLayout>
<!--        <StackLayout v-for="(dAry,name,idx) in actions" :key="'sia-'+idx" row="0" :col="idx" borderRadius="5" class="bcp font-weight-bold text-center c-white fs18 m-r-5">-->
<!--            <FontIcon class="m-t-12">{{ dAry[1] }}</FontIcon>-->
<!--            <TextBold class="c-white" style="color: #FFFFFF">{{ dAry[0] }}</TextBold>-->
<!--        </StackLayout>-->
    </GridLayout>
</template>

<script>
    export default {
        name: "WSSaleItemActions",
        data(){ return {
            actions: {
                'edit-quantity': ['Change Quantity','add_shopping_cart'],
                'edit-discount': ['Change Discount','edit'],
                'edit-rate': ['Change Rate','attach-money'],
                'delete': ['Remove Item','delete'],
            }
        }}
    }
</script>
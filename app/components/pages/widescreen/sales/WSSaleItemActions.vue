<template>
    <GridLayout rows="auto" columns="*,*">
        <StackLayout @tap="$emit('edit')" row="0" col="0" borderRadius="5" class="bcp font-weight-bold text-center c-white fs18 m-r-5" height="80">
            <FontIcon class="m-t-12">edit</FontIcon>
            <TextBold class="c-white" style="color: #FFFFFF">Change Quantity</TextBold>
        </StackLayout>
        <StackLayout @tap="$emit('delete')" row="0" col="1" borderRadius="5" class="bcp font-weight-bold text-center c-white fs18" height="80">
            <FontIcon class="m-t-12">delete</FontIcon>
            <TextBold class="c-white" style="color: #FFFFFF">Remove Item</TextBold>
        </StackLayout>
    </GridLayout>
</template>

<script>
    export default {
        name: "WSSaleItemActions"
    }
</script>
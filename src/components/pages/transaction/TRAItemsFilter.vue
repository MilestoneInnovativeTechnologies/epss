<template>
    <GridLayout columns="*,auto">
        <TextField ref="search_text_field" hint="Search" col="0" v-model="value" @textChange="emit" class="m-y-10" />
        <StackLayout v-if="value" col="1" class="bcg01" verticalAlignment="center" @tap="value = ''">
            <FontIcon class="cp text-center w-full" size="28">cancel</FontIcon>
        </StackLayout>
    </GridLayout>
</template>

<script>
    import {EventListeners} from "../../../assets/scripts/mixins/eventlisteners";

    const emitText = _.debounce((vm,text) => vm.$emit('textChange',text),1500,{ trailing:true });

    export default {
        name: "TRAItemsFilter",
        mixins: [EventListeners],
        data(){ return { value:'',events: ['tra-item-selected'], } },
        methods: {
            emit({ value }){ emitText(this,value) },
            listener0(){ this.$refs['search_text_field'].nativeView.dismissSoftInput(); },
        }
    }
</script>

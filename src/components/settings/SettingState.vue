<template>
    <StackLayout style="border-left-width:2; border-color: #EF6D3B;" class="m-y-2">
        <TextNormal v-if="text" textWrap="true" :text="text" class="cp m-l-15"></TextNormal>
        <AppForm :fields="fields" :values="values" @final="saveFinal"></AppForm>
    </StackLayout>
</template>

<script>
    import {SettingsCommonMixin} from "../../assets/scripts/mixins/settingscommon";
    const fieldName = 'SettingValue';

    export default {
        name: "SettingState",
        mixins: [SettingsCommonMixin],
        props: ['module','prop','text','editor','options','switch'],
        computed: {
            values(){
                return _.zipObject([fieldName],[(((this.module)
                    ? this.$store.state[this.module][this.prop]
                    : this.$store.state[this.prop]) || '')]);
            },
        },
        methods: {
            saveFinal(obj){
                let value = obj[fieldName];
                if(this.module) this.$store.state[this.module][this.prop] = value;
                else this.$store.state[this.prop] = value;
            },
        }
    }
</script>
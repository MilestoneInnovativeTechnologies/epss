<template>
    <App title="Settings" action="Save and Return" @save-and-return="home" :actionProps="{ isEnabled:actionEnable }">
        <AppForm :fields="fields" @tag="tag = $event"></AppForm>
        <HorizontallyMiddle>
            <component width="400" :is="component" v-for="({ component,bind,tags },idx) in components" v-bind="bind" :key="'settings-component-' + idx" v-show="tag.trim() === '' || tags.includes(tag)"></component>
        </HorizontallyMiddle>
    </App>
</template>

<script>
    import {Home} from "../../assets/scripts/navigations";
    const feMX = require('./../../assets/scripts/mixins/formelement');
    const settings = require('./../../assets/scripts/settings').Settings;

    export default {
        name: "SettingsIndex",
        mixins: [feMX.common,feMX.text],
        data(){ return { actionEnable:true,tag:'' } },
        computed: {
            fields(){ return _.mapValues(this.appFormFields({ tag:'Text' }),obj => { obj.label = 'Search for settings'; return obj; }) },
            components(){
                return _.map(settings,setting => {
                    return _.isString(setting)
                        ? getStringComponent(setting)
                        : getObjectComponent(setting);
                }).filter(obj => obj);
            }
        },
        methods: {
            home(){ this.actionEnable = false; setTimeout(() => this.$navigateTo(Home),2000) }
        }
    }

    function getStringComponent(text){
        let component = text.length > 20 ? 'TextNormal' : 'TextHeading';
        return { component,bind:{ text,textWrap:true },tags:'' }
    }

    function getObjectComponent(obj){
        let component = 'Setting' + _.startCase(obj.type), bind = _.omit(obj,['type','tags']), tags = obj.tags || '';
        return { component,bind,tags }
    }
</script>
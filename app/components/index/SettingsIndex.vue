<template>
    <App title="Settings" action="Save and Return" @save-and-return="home" :actionProps="{ isEnabled:actionEnable }">
        <AppForm :fields="fields" @tag="tag = $event" />
        <HorizontallyMiddle>
            <component width="400" :is="component" v-for="({ component,bind },idx) in components" v-bind="bind" :key="'settings-component-' + idx" v-show="tag.trim() === '' || tags[idx].includes(tag)" />
        </HorizontallyMiddle>
    </App>
</template>

<script>
    const Home = require('./../Home').default;
    const feMX = require('./../../assets/scripts/mixins/formelement');

    export default {
        name: "SettingsIndex",
        mixins: [feMX.common,feMX.text],
        data(){ return { actionEnable:true,tag:'',tags:{},hd:null } },
        computed: {
            fields(){ return _.mapValues(this.appFormFields({ tag:'Text' }),obj => { obj.label = 'Search for settings'; return obj; }) },
            components(){
                let vm = this;
                return _.map(require('./../../assets/scripts/settings').Settings,(setting, idx) => {
                    vm['tags'][idx] = (setting.tags && setting.tags.trim() !== '') ? setting.tags.toLowerCase() : '';
                    if(_.isString(setting)) vm['hd'] = idx; else if(vm['hd'] !== null) vm['tags'][vm['hd']] += ' ' + vm['tags'][idx];
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
        return { component,bind:{ text,textWrap:true } }
    }

    function getObjectComponent(obj){
        let component = 'Setting' + _.startCase(obj.type), bind = _.omit(obj,['type','tags']);
        return { component,bind }
    }
</script>
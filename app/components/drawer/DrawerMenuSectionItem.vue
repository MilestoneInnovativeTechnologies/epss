<template>
    <GridLayout style="border-bottom-width: 1px; border-bottom-color: #FFFFFF" columns="4,*">
        <Label text="" col="0"></Label>
        <GridLayout col="1" rows="35" columns="*" class="p-l-16" backgroundColor="#FF8855" @tap="proceedNavigation">
            <TextRegular col="0" row="0" verticalAlignment="center" class="text-uppercase">{{ itemName }}</TextRegular>
        </GridLayout>
    </GridLayout>
</template>

<script>
    import {AccountKeyDefaults} from "../../assets/scripts/mixins/accountkeydefaults";

    export default {
        name: "DrawerMenuSectionItem",
        mixins: [AccountKeyDefaults],
        props: ['item'],
        computed: {
            itemName(){ return this.item.drawer_display },
            itemIcon(){ return this.item.icon },
            fncode(){ return this.item.fncode },
            component(){ return require('./../index/'+this.item.component+'.vue').default; },
            cProps(){ return this.item.props.split(','); },
        },
        methods: {
            proceedNavigation(){
                this.ELOff('account-defaults-set',this.navigate); this.ELOn('account-defaults-set',this.navigate);
                this.navigate();
            },
            navigate(){
                this.ELOff('absolute-form-submit',this.listener0);
                if(!this.cProps[0]) return this.doNavigate({});
                let nProps = _.zipObject(this.cProps,this.cProps.map(prop => this[prop]));
                if(_.every(nProps)) return this.doNavigate(nProps);
                this.ACCKDs_requestDefaults();
            },
            doNavigate(props){
                this.ELOff('account-defaults-set');
                this.$navigateTo(this.component,{ props });
            },
        }
    }
</script>
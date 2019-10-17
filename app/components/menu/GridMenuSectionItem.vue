<template>
    <StackLayout @tap="proceedNavigation" :borderRadius="item_border_radius" class="bcp font-weight-bold text-center c-white fs18" :height="height">
        <FontIcon class="m-t-12">{{ itemIcon }}</FontIcon>
        <TextBold class="c-white" style="color: #FFFFFF">{{ itemName }}</TextBold>
    </StackLayout>
</template>
c
<script>
    import {AccountKeyDefaults} from "../../assets/scripts/mixins/accountkeydefaults";

    export default {
        name: "GridMenuSectionItem",
        mixins: [AccountKeyDefaults],
        props: ['item','height'],
        data(){ return {
            menu_height: 80,
            item_border_radius: 5,
        } },
        computed: {
            itemName(){ return this.item.home_display },
            itemIcon(){ return this.item.icon },
            fncode(){ return this.item.fncode },
            component(){ return require('./../index/'+this.item.component+'.vue').default; },
            cProps(){ return this.item.props.split(','); },
            nProps(){ let vm = this, cProps = this.cProps; return _.zipObject(cProps,cProps.map(prp => vm[prp])); },
        },
        methods: {
            proceedNavigation(){
                this.ELOff('account-defaults-set',this.navigate); this.ELOn('account-defaults-set',this.navigate);
                this.navigate();
            },
            navigate(){
                this.ELOff('absolute-form-submit',this.listener0);
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
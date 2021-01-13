<template>
    <StackLayout @tap="navigate" :borderRadius="item_border_radius" class="bcp font-weight-bold text-center c-white fs18" :height="height">
        <FontIcon class="m-t-12">{{ itemIcon }}</FontIcon>
        <TextBold class="c-white" style="color: #FFFFFF">{{ itemName }}</TextBold>
    </StackLayout>
</template>
<script>
    export default {
        name: "GridMenuSectionItem",
        props: ['item','height'],
        data(){ return {
            menu_height: 80,
            item_border_radius: 5,
        } },
        computed: {
            itemName(){ return this.item.home_display },
            itemIcon(){ return this.item.icon },
            fncode(){ return this.item.fncode },
            fycode(){ return this.$store.state.default_fycode },
            store(){ return this.$store.state.default_store },
            component(){ return require('./../index/'+this.item.component+'.vue').default },
            cProps(){ return this.item.props.split(',') },
        },
        methods: {
            navigate(){
                if(!this.cProps[0]) return this.doNavigate({});
                let nProps = _.zipObject(this.cProps,this.cProps.map(prop => this[prop]));
                if(_.every(nProps)) return this.doNavigate(nProps);
            },
            doNavigate(props){
                this.$navigateTo(this.component,{ props });
            },
        }
    }
</script>
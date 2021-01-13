<template>
    <GridLayout style="border-bottom-width: 1px; border-bottom-color: #FFFFFF" columns="4,*">
        <Label text="" col="0"></Label>
        <GridLayout col="1" rows="35" columns="*" class="p-l-16" backgroundColor="#FF8855" @tap="navigate">
            <TextRegular col="0" row="0" verticalAlignment="center" class="text-uppercase">{{ itemName }}</TextRegular>
        </GridLayout>
    </GridLayout>
</template>

<script>
    export default {
        name: "DrawerMenuSectionItem",
        props: ['item'],
        computed: {
            itemName(){ return this.item.drawer_display },
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
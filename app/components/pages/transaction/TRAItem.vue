<template>
    <GridLayout :width="width" :height="height" ref="item" :rows="rows" :columns="cols" class="p-t-2 item-grid" @tap="addItem(item)">
        <Image row="0" col="0" colSpan="2" rowSpan="2" :src="src" loadMode="async" stretch="aspectFill" useCache="true" />
        <Label row="1" col="0" :text="name" class="fsb p-5 label-grid cp" :class="labelFontSize" textWrap="true"></Label>
        <StackLayout row="1" col="1" :height="priceLength[1]" verticalAlignment="middle" style="background-color: #FFFFFF">
            <Label :width="priceLength[0]" :text="rate" class="fsb fs14 text-center cp c-bg-white"></Label>
        </StackLayout>
    </GridLayout>
</template>

<script>
    import { mapGetters } from 'vuex';
    const { fromNativeSource } = require("tns-core-modules/image-source");

    export default {
        name: "TRAItem",
        props: ['item','width','height','priceWidth'],
        data(){
            let spanLength = this.width, labelLength = [this.width - this.priceWidth - 5,this.height - this.width], priceLength = [this.priceWidth,this.height - this.width],
                rows = [spanLength,labelLength[1]].join(','), cols = [labelLength[0],priceLength[0]].join(',');
            return { spanLength, labelLength, priceLength, rows, cols, src:null }
        },
        computed: {
            ...mapGetters('Product',['imagePath']),
            name(){ return this.item.narration },
            rate(){ return __.rate(this.item.price) },
            labelFontSize(){ return (this.name.toString().length > 30) ? ['fs8'] : ['fs10']},
            imageURL(){ return [this.imagePath,this.item.id].join('') },
            cacheKey(){ return 'item-image-' + this.item.id }
        },
        methods: {
            addItem(item){ EB.$emit('tra-item-selected',this.item) }
        },
        created(){
            let imgSrc = ImageCache.get(this.cacheKey);
            if(imgSrc) return this.src = fromNativeSource(imgSrc);
            this.src = ImageCache.placeholder;
            let url = this.imageURL, key = this.cacheKey, vm = this;
            ImageCache.enqueue({ key,url,completed(image){ vm.src = fromNativeSource(image) } })
        }
    }
</script>

<style>
    .item-grid {
        background-position: center center;
        background-repeat: no-repeat;
        background-size: contain;
    }
    .label-grid {
        background-image: url("~/assets/images/t80.png");
        background-repeat: repeat;
    }
</style>
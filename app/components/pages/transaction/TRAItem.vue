<template>
    <GridLayout :width="width" :height="height" ref="item" rows="*,auto" columns="*,50" class="p-t-2 item-grid" @tap="addItem(item)">
        <Image row="0" col="0" colSpan="2" :decodeHeight="height" :decodeWidth="width" rowSpan="2" :src="src" loadMode="async" stretch="aspectFill" useCache="true" />
        <Label row="0" col="0" colSpan="2" :textWrap="true" />
        <Label row="1" col="0" :text="name" class="fsb p-l-10 p-y-4 label-grid cp" :class="fontSizeCls" :textWrap="true" />
        <StackLayout row="1" col="1" class="c-bg-white">
            <Label :text="rate" :textWrap="true" class="fsb fs16 text-center cp" />
        </StackLayout>
    </GridLayout>
</template>

<script>
    import { mapGetters } from 'vuex';
    const { ImageSource } = require("@nativescript/core");

    export default {
        name: "TRAItem",
        props: ['item','width','height'],
        data(){ return { src:null  } },
        computed: {
            ...mapGetters('Product',['imagePath']),
            name(){ return this.item.narration },
            rate(){ return __.rate(this.item.price) },
            imageURL(){ return [this.imagePath,this.item.id].join('') },
            cacheKey(){ return 'item-image-' + this.item.id },
            fontSizeCls(){ return this.name.toString().length > 30 ? 'fs10' : 'fs12' }
        },
        methods: {
            addItem(item){ clickTune.play(); EB.$emit('tra-item-selected',item) }
        },
        created(){
            let imgSrc = ImageCache.get(this.cacheKey);
            if(imgSrc) return this.src = new ImageSource(imgSrc);
            this.src = ImageCache.placeholder;
            let url = this.imageURL, key = this.cacheKey, vm = this;
            ImageCache.enqueue({ key,url,completed(image){ vm.src = new ImageSource(image); } })
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

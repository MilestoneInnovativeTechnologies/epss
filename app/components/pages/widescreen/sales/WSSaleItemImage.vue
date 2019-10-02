<template>
    <Image :src="src" loadMode="async" stretch="aspectFill" useCache="true" />
</template>

<script>
    import { mapGetters } from 'vuex';
    import {no_image_file, product_image_cache_max_request} from "../../../../assets/scripts/constants";
    const Cache = require("tns-core-modules/ui/image-cache").Cache;
    const { fromFile,fromNativeSource } = require("tns-core-modules/image-source");

    export default {
        name: "WSSaleItemImage",
        props: ['item'],
        data(){ return {
            src: null,
        } },
        computed: {
            ...mapGetters('Product',['imagePath']),
            url(){ return [this.imagePath,this.item.id].join('') },
        },
        created(){
            let url = this.url, cache = new Cache(); cache.placeholder = fromFile(no_image_file); cache.maxRequests = product_image_cache_max_request;
            this.src = cache.placeholder; const image = cache.get(url);
            if(image){ this.src = fromNativeSource(image) }
            else {
                cache.push({ key:url,url:url,completed:(img,key) => { if(url === key) this.src = fromNativeSource(img); } })
                cache.enableDownload();
            }
            cache.disableDownload();
        }
    }
</script>
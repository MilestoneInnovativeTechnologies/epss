<template>
    <WrapLayout>
        <StackLayout v-for="(pageNum,idx) in combined" :key="'ilp-'+idx" @tap="$emit('change-page-to',pageNum)" :width="size" :height="size" verticalAlignment="middle" :class="curPage == pageNum ? 'bcp' : ''">
            <Label :text="pageNum" class="text-center fs16 fsb" :class="curPage == pageNum ? 'font-weight-bold c-white' : ''" />
        </StackLayout>
    </WrapLayout>
</template>

<script>
    export default {
        name: "TRAItemsPagination",
        props: ['totPage','curPage'],
        data(){ return {
            sep: '...',
            size: 50,
        }},
        computed: {
            start(){ return (_.toSafeInteger(this.totPage) <= 3) ? _.range(1,4) : [1,2,3] },
            end(){ return (_.toSafeInteger(this.totPage) <= 2) ? [1,2] : _.range(this.totPage,_.toSafeInteger(this.totPage)-2).reverse() },
            middle(){
                let curPage = this.curPage, totPage = this.totPage;
                let page = _.toSafeInteger(curPage), total = _.toSafeInteger(totPage), mid = [page];
                if(page-1 > 0){
                    mid.unshift(page-1);
                    if(page+1 <= total) mid.push(page+1);
                } else mid.push(page+1);
                if(page-2 > 0){
                    mid.unshift(page-2);
                    if(page+2 <= total) mid.push(page+2);
                } else {
                    if(_.last(mid) < total) mid.push(_.last(mid)+1)
                }
                return mid;
            },
            combined(){
                let start = this.start, middle = this.middle, end = this.end;
                let first = ( _.last(start)+1 < _.head(middle) ) ? _.concat(start,[this.sep],middle) : _.uniq(_.concat(start,middle));
                let combined = ( _.last(first)+1 < _.head(end) ) ? _.concat(first,[this.sep],end) : _.uniq(_.concat(first,end));
                return combined;
            }
        }
    }
</script>
<template>
    <StackLayout class="appff-container">
        <GridLayout :rows="rows" columns="*" style="border-width:5; border-color: #EF6D3B;">
            <GridLayout v-for="(columns,row) in fieldRow" :row="row" col="0" rows="auto" :columns="columns.join(',')" :key="['ff',unique,'fr',row].join('-')">
                <AppForm v-for="(column,col) in columns" :col="col" :fields="getField(posNum(row,col))" :values="getFieldValue(posNum(row,col))" @final="setFinal" :key="['ff',unique,'fr',row,'frc',col].join('-')"></AppForm>
            </GridLayout>
            <GridLayout :row="labelsStartRowNum+row" col="0" v-for="(columns,row) in labelRow" rows="auto" :columns="getRepeated('*',columns.length)" class="p-24" :key="['ff',unique,'lr',row].join('-')">
                <AppInfoWithLabel row="0" v-for="(cTxt,col) in columns" :col="col" :title="labels[posNum(row,col)]" :key="['ff',unique,'lr',row,'lrc',col,labelCode(posNum(row,col))].join('-')">{{ labelValues[labels[posNum(row,col)]] }}</AppInfoWithLabel>
            </GridLayout>
            <AppButton :row="actionButtonRowNum" col="0" v-if="action" class="c-white p-y-20" @tap.native="$emit('done',final)">{{ action }}</AppButton>
        </GridLayout>
        <TextHighlight class="text-center m-t-8" @tap.native="$emit('close')">Close Window</TextHighlight>
    </StackLayout>
</template>

<script>
    export default {
        name: "AppFloatForm",
        props: {
            fields:Object,
            labels:Array,
            maxInARow:{ type:Number,default:3 },
            fieldValues:Object,
            labelValues:Object,
            action:String,
        },
        data(){ return {
            final: {}
        }},
        computed: {
            unique(){ return new Date().getTime() },
            fieldRow(){ return this.gridDistributeLogic(_.size(this.fields)) },
            labelRow(){ return this.gridDistributeLogic(_.size(this.labels)) },
            rows(){ return _.map(Array(this.fieldRow.length + this.labelRow.length + 1),()=>'auto').join(',') },
            labelsStartRowNum(){ return this.fieldRow.length },
            actionButtonRowNum(){ return this.fieldRow.length+this.labelRow.length },
            labelCode(){ return (pos) => (this.labels && this.labels[pos] && this.labelValues && this.labelValues[this.labels[pos]]) ? _.kebabCase(this.labelValues[this.labels[pos]]) : '' }
        },
        methods: {
            gridDistributeLogic(num){
                let ls = 2,mx = this.maxInARow, nm = _.toSafeInteger(num);
                let rows = _.map(Array(Math.floor(((nm-1)/mx)+1)),() => _.reverse(_.map(Array(mx),(e,i)=>(i+ls)+'*')));
                if(nm%mx > 0) rows[rows.length - 1] = _.reverse(_.map(_.range(ls,ls+(nm%mx)),(e)=> e+'*'));
                return rows;
            },
            getField(col){
                let name = _.keys(this.fields)[col];
                return _.zipObject([name],[_.get(this.fields,name)]);
            },
            getFieldValue(col){
                let name = _.keys(this.fields)[col];
                return _.zipObject([name],[_.get(this.fieldValues,name)]);
            },
            getRepeated(txt,num){
                return _.map(Array(num),() => txt).join(',')
            },
            posNum(row,col){ return (row*this.maxInARow) + col },
            setFinal(result){
                if(result) this.final = Object.assign({},this.final,result);
                this.$emit('final',this.final);
            }
        }
    }
</script>
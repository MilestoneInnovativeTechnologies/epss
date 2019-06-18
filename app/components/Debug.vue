<!--suppress ALL -->
<template>
    <App title="DEBUG">
        <Button text="Write file..." @tap="writeFile" />
        <AppList :limit="limit"></AppList>
    </App>
</template>

<script>
    export default {
        name: "Debug",
        data(){ return {
            limit:1,
        }},
        methods: {
            writeFile(){
                let FDStatus = FD.init({ name:'File',type:'Upload' },function(a,b){
                    console.log(this.vParams,'From after FD',a,b)
                },'Fir','Ose').file([{ table:'users', primary_key:[], mode:'create', data:[{id:10,name:'ABC'},{id:11,name:'XYZ'}] }],'ACTTest');
            },
            addSales(){

            }
        }
    }
</script>
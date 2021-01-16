export const Settings = [
    'If have multiple Stores or Fiscal years active, then for doing transactions, choose default store and fiscal year',
    { type:'state',module:'',prop:'default_store',text:'Select a default Store for having transactions',editor:'Store',tags:'default store' },
    { type:'state',module:'',prop:'default_fycode',text:'Select a default Fiscal year for having transactions',editor:'Fiscal',tags:'default fiscal fycode' },
    'Printing - Print attributes like width of paper, printer address, uuid etc are covered in this portion',
    { type:'db',table:'user_settings',field:'value',row:{ setting:1 },text:'[settings,description,1]',default:'[settings,value,1]',switch:true,tags:'print' },
    { type:'db',table:'user_settings',field:'value',row:{ setting:2 },text:'[settings,description,2]',default:'[settings,value,2]',editor:'Text',tags:'print uuid' },
    { type:'db',table:'user_settings',field:'value',row:{ setting:3 },text:'[settings,description,3]',default:'[settings,value,3]',editor:'Text',tags:'print address' },
    { type:'db',table:'epss_app',field:'detail',row:{ name:'print_width' },text:'Print Paper width - max characters in a line',editor:'Text',tags:'print width' },
    'Widgets, provides count/sum information of a particular resource. This section is to enable/disable these widgets of their appropriate pages.',
    { type:'db',table:'user_settings',field:'value',row:{ setting:4 },text:'[settings,description,4]',default:'[settings,value,4]',switch:true,tags:'widget home outstanding out standing' },
    { type:'db',table:'user_settings',field:'value',row:{ setting:5 },text:'[settings,description,5]',default:'[settings,value,5]',switch:true,tags:'widget home screen sales' },
    { type:'db',table:'user_settings',field:'value',row:{ setting:6 },text:'[settings,description,6]',default:'[settings,value,6]',switch:true,tags:'widget receipts weekly' },
    { type:'db',table:'user_settings',field:'value',row:{ setting:7 },text:'[settings,description,7]',default:'[settings,value,7]',switch:true,tags:'widget receipts monthly' },
    { type:'db',table:'user_settings',field:'value',row:{ setting:8 },text:'[settings,description,8]',default:'[settings,value,8]',switch:true,tags:'widget sales total' },
    { type:'db',table:'user_settings',field:'value',row:{ setting:9 },text:'[settings,description,9]',default:'[settings,value,9]',switch:true,tags:'widget sales total weekly monthly' },
    { type:'db',table:'user_settings',field:'value',row:{ setting:10 },text:'[settings,description,10]',default:'[settings,value,10]',switch:true,tags:'widget sales total daily' },
    { type:'db',table:'user_settings',field:'value',row:{ setting:11 },text:'[settings,description,11]',default:'[settings,value,11]',switch:true,tags:'widget sales total daily' },
    'Advanced Sale. These settings are applicable for wide screen pos devices only. Here can manage Items per screen, dimension if item and other settings',
    { type:'db',table:'user_settings',field:'value',row:{ setting:12 },text:'[settings,description,12]',default:'[settings,value,12]',editor:'Number',tags:'advance sales container width' },
    { type:'db',table:'user_settings',field:'value',row:{ setting:13 },text:'[settings,description,13]',default:'[settings,value,13]',editor:'Number',tags:'advance sales left portion' },
    { type:'db',table:'user_settings',field:'value',row:{ setting:14 },text:'[settings,description,14]',default:'[settings,value,14]',editor:'Number',tags:'advance sales left right' },
    { type:'db',table:'user_settings',field:'value',row:{ setting:15 },text:'[settings,description,15]',default:'[settings,value,15]',editor:'Number',tags:'advance sales container padding' },
    { type:'db',table:'user_settings',field:'value',row:{ setting:16 },text:'[settings,description,16]',default:'[settings,value,16]',editor:'Number',tags:'advance sales main filter width' },
    { type:'db',table:'user_settings',field:'value',row:{ setting:17 },text:'[settings,description,17]',default:'[settings,value,17]',editor:'Number',tags:'advance sales secondary filter height' },
    { type:'db',table:'user_settings',field:'value',row:{ setting:18 },text:'[settings,description,18]',default:'[settings,value,18]',editor:'Text',tags:'advance sales item width height ratio' },
    { type:'db',table:'user_settings',field:'value',row:{ setting:19 },text:'[settings,description,19]',default:'[settings,value,19]',editor:'Number',tags:'advance sales items products row' },
    { type:'db',table:'user_settings',field:'value',row:{ setting:20 },text:'[settings,description,20]',default:'[settings,value,20]',editor:'Number',tags:'advance sales items products row' },
    { type:'db',table:'user_settings',field:'value',row:{ setting:21 },text:'[settings,description,21]',default:'[settings,value,21]',editor:'Number',tags:'advance sales items products space' },
];
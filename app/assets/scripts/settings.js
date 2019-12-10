export const Settings = [
    'Default',
    'A txt having more thatn 20 characters means descriptions. Am i right',
    { type:'state',module:'',prop:'default_store',text:'Select a default store for having transactions',editor:'Store',tags:'default store' },
    { type:'state',module:'',prop:'default_fycode',editor:'Fiscal',tags:'default fiscal fycode' },
    'A txt having more thatn 20 characters means descriptions. Am i right. India is my country..',
    { type:'state',module:'',prop:'defaults',text:'Select a default fiscal year for having transactions',editor:'Customer',tags:'customer' },
    { type:'state',module:'',prop:'defauults',text:'Select a default fiscal year for having transactions',editor:'Product',tags:'products' },
    { type:'db',table:'epss_app',field:'detail',row:{ name:'print_width' },text:'Print Paper width - max characters in a line',editor:'Text',tags:'print width' },
    { type:'db',table:'epss_app',field:'detail',row:{ name:'print_height' },text:'Print Paper height - max height a roll have',editor:'Text',tags:'print height' },
    { type:'db',table:'epss_app',field:'detail',row:{ name:'switch_test' },editor:'Picker',options:'Sw1,Sw2,Sw3,SW6',tags:'switch' },
    { type:'db',table:'epss_app',field:'detail',row:{ name:'switch_value' },switch:true,tags:'yes no' },
];
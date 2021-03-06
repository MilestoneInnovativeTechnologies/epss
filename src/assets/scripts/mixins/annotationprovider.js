export const PropertyAnnotationValuesProvider = {
    data(){ return {
        valuesProviderTypeEditors: ['Picker', 'SegmentedEditor', 'List', 'AutoCompleteInline'],
        pavpSourceValues: {}, pavpPatchValues: {},
        pavpValueConverter: {}, pavpConverterParams: {}
    }},
    methods: {
        pavpAnnotationName(Annotation){ return _.get(Annotation,'name'); },
        pavpSetSourceValue(name,value){
            let valObj = _.zipObject([name],[value]);
            this.pavpSourceValues = Object.assign({},this.pavpSourceValues,valObj);
        },
        pavpSetPatchValue(name,value){
            let valObj = _.zipObject([name],[value]);
            this.pavpPatchValues = Object.assign({},this.pavpPatchValues,valObj);
            return value;
        },
        pavpSetValueConverter(name,type,params){
            let setObj = _.zipObject([name],[type]);
            this.pavpValueConverter = Object.assign({},this.pavpValueConverter,setObj);
            if(params){ this.pavpConverterParams = Object.assign({},this.pavpConverterParams,_.zipObject([name],[params])); }
        },
        pavpValuesPatchedAnnotation(Annotation) {
            if (_.includes(this.valuesProviderTypeEditors, Annotation.editor)) {
                let currentValue = _.get(Annotation,'valuesProvider'), newValue = null;
                if(_.isString(currentValue)) newValue = this.pavpProviderFromString(currentValue,Annotation);
                else if(_.isArray(currentValue)) newValue = this.pavpProviderFromArray(currentValue,Annotation);
                else if(_.isObject(currentValue)) newValue = this.pavpProviderFromObject(currentValue,Annotation);
                else newValue = this.pavpProviderFromArray([''],Annotation);
                Annotation = Object.assign({},Annotation,{ valuesProvider:newValue })
            }
            return Annotation
        },
        pavpProviderFromString(str,Annotation){
            let srcValues = str.split(',');
            let name = this.pavpAnnotationName(Annotation);
            this.pavpSetSourceValue(name,srcValues);
            this.pavpSetValueConverter(name,'Same');
            return this.pavpSetPatchValue(name,srcValues);
        },
        pavpProviderFromObject(obj,Annotation){
            if(_.has(obj,'items') && _.isArray(obj['items'])) return this.pavpProviderFromCollection(obj,Annotation);
            let srcValues = obj;
            let name = this.pavpAnnotationName(Annotation);
            this.pavpSetSourceValue(name,srcValues);
            this.pavpSetValueConverter(name,'Object');
            return this.pavpSetPatchValue(name,_.map(srcValues));
        },
        pavpProviderFromArray(array,Annotation){
            let srcValues = array;
            let name = this.pavpAnnotationName(Annotation);
            this.pavpSetSourceValue(name,srcValues);
            this.pavpSetValueConverter(name,'Array');
            return this.pavpSetPatchValue(name,srcValues);
        },
        pavpProviderFromCollection(collection,Annotation){
            let { key,label,items:srcValues } = collection;
            let name = this.pavpAnnotationName(Annotation);
            this.pavpSetSourceValue(name,srcValues);
            this.pavpSetValueConverter(name,'Collection',{ key,label });
            return this.pavpSetPatchValue(name,_.map(srcValues,label));
        },
        pavpValueConverterSame(value){ return value; },
        pavpValueConverterArray(value,name){ return _.indexOf(this.pavpSourceValues[name],value); },
        pavpValueConverterObject(value,name){ return _.get(_.invert(this.pavpSourceValues[name]),value); },
        pavpValueConverterCollection(value,name){
            let { key,label } = this.pavpConverterParams[name];
            return _.get(_.find(this.pavpSourceValues[name],[label,value]),key)
        },
        pavpNameConverterSame(value){ return value; },
        pavpNameConverterArray(value,name){ return this.pavpSourceValues[name][value]; },
        pavpNameConverterObject(value,name){ return this.pavpSourceValues[name][value]; },
        pavpNameConverterCollection(value,name){
            let { key,label } = this.pavpConverterParams[name];
            return _.get(_.find(this.pavpSourceValues[name],[key,value]),label)
        },
        pavpGetAnnotationValueConverted(name,value){
            if(!this.pavpValueConverter[name]) return _.isNil(value) ? '' : value;
            let method = 'pavpValueConverter' + this.pavpValueConverter[name];
            value = _.isNil(value) ? _.head(this.pavpPatchValues[name]) : value;
            return this[method](value,name);
        },
        pavpGetAnnotationNameConverted(name,value){
            console.warn('pavpGetAnnotationNameConverted',name,this.pavpValueConverter[name]);
            if(!this.pavpValueConverter[name]) return _.isNil(value) ? '' : value;
            value = _.isNil(value) ? this.pavpGetAnnotationValueConverted(name,_.head(this.pavpPatchValues[name])) : value;
            console.warn('pavpGetAnnotationNameConverted 2',name,value);
            let method = 'pavpNameConverter' + this.pavpValueConverter[name];
            console.warn('pavpGetAnnotationNameConverted 3',name,value,method);
            return this[method](value,name);
        }
    }
};
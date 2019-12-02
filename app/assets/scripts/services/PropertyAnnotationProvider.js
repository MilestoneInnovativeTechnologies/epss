export class PropertyAnnotationProvider {

    constructor(fields,morph,metadata){
        this.valuesProviderTypeEditors = ['Picker', 'SegmentedEditor', 'List', 'AutoCompleteInline'];

        this.morph = {label: 'displayName', type: 'editor', values: 'valuesProvider'};
        if(morph) _.assign(this.morph,morph);

        this.metadata = { isReadOnly:false, commitMode:'Immediate', validationMode:'Immediate' , propertyAnnotations:null };
        if(metadata) _.assign(this.metadata,metadata);

        this.SourceValues = {}; this.PatchValues = {};
        this.ValueConverter = {}; this.ConverterParams = {};

        this.Annotations = [];

        if(fields) this.AnnotationFields(fields);
    }

    AnnotationName(Annotation){ return _.get(Annotation,'name'); }

    AnnotationFields(fields){
        _.forEach(fields, (Obj, name) => this.Annotations.push(this.getPropertyAnnotation(name, Obj)));
        this.metadata['propertyAnnotations'] = this.Annotations;
    }

    getPropertyAnnotation(name, Obj) {
        let morph = this.morph, Annotation = {name};
        Annotation = _.reduce(Obj, function (Annotation, value, key) {
            Annotation[_.has(morph, key) ? morph[key] : key] = value;
            return Annotation;
        }, Annotation);
        return this.ValuesPatchedAnnotation(Annotation);
    }

    SetSourceValue(name, value) {
        this.SourceValues[name] = value;
    }

    SetPatchValue(name, value) {
        this.PatchValues[name] = value;
        return value;
    }

    SetValueConverter(name, type, params) {
        this.ValueConverter[name] = type;
        if (params) {
            this.ConverterParams[name] = params;
        }
    }

    ValuesPatchedAnnotation(Annotation) {
        if (_.includes(this.valuesProviderTypeEditors, Annotation.editor)) {
            let currentValue = _.get(Annotation, 'valuesProvider'), newValue = null;
            if (_.isString(currentValue)) newValue = this.ProviderFromString(currentValue, Annotation);
            else if (_.isArray(currentValue)) newValue = this.ProviderFromArray(currentValue, Annotation);
            else if (_.isObject(currentValue)) newValue = this.ProviderFromObject(currentValue, Annotation);
            else newValue = this.ProviderFromArray([''], Annotation);
            Annotation['valuesProvider'] = newValue;
        }
        return Annotation
    }

    ProviderFromString(str, Annotation) {
        let srcValues = str.split(',');
        let name = this.AnnotationName(Annotation);
        this.SetSourceValue(name, srcValues);
        this.SetValueConverter(name, 'Same');
        return this.SetPatchValue(name, srcValues);
    }

    ProviderFromObject(obj, Annotation) {
        if (_.has(obj, 'items') && _.isArray(obj['items'])) return this.ProviderFromCollection(obj, Annotation);
        let srcValues = obj;
        let name = this.AnnotationName(Annotation);
        this.SetSourceValue(name, srcValues);
        this.SetValueConverter(name, 'Object');
        return this.SetPatchValue(name, _.map(srcValues));
    }

    ProviderFromArray(array, Annotation) {
        let srcValues = array;
        let name = this.AnnotationName(Annotation);
        this.SetSourceValue(name, srcValues);
        this.SetValueConverter(name, 'Array');
        return this.SetPatchValue(name, srcValues);
    }

    ProviderFromCollection(collection, Annotation) {
        let {key, label, items: srcValues} = collection;
        let name = this.AnnotationName(Annotation);
        this.SetSourceValue(name, srcValues);
        this.SetValueConverter(name, 'Collection', {key, label});
        return this.SetPatchValue(name, _.map(srcValues, label));
    }

    ValueConverterSame(value) { return value; }
    ValueConverterArray(value, name) { return _.indexOf(this.SourceValues[name], value); }
    ValueConverterObject(value, name) { return _.get(_.invert(this.SourceValues[name]), value); }
    ValueConverterCollection(value, name) {
        let {key, label} = this.ConverterParams[name];
        return _.get(_.find(this.SourceValues[name], [label, value]), key)
    }
    NameConverterSame(value) { return value; }
    NameConverterArray(value, name) { return this.SourceValues[name][value]; }
    NameConverterObject(value, name) { return this.SourceValues[name][value]; }
    NameConverterCollection(value, name) {
        let {key, label} = this.ConverterParams[name];
        return _.get(_.find(this.SourceValues[name], [key, value]), label)
    }

    GetAnnotationValueConverted(name, value) {
        if (!this.ValueConverter[name]) return _.isNil(value) ? '' : value;
        let method = 'ValueConverter' + this.ValueConverter[name];
        value = _.isNil(value) ? _.head(this.PatchValues[name]) : value;
        return this[method](value, name);
    }

    GetAnnotationNameConverted(name, value) {
        if (!this.ValueConverter[name]) return _.isNil(value) ? '' : value;
        value = (_.isNil(value) || value === '') ? this.GetAnnotationValueConverted(name, _.head(this.PatchValues[name])) : value;
        let method = 'NameConverter' + this.ValueConverter[name];
        return this[method](value, name);
    }
}
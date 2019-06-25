<template>
    <StackLayout>
        <TextTitleSub class="m-15 w-100 text-center" v-if="title">{{ title }}</TextTitleSub>
        <RadDataForm :source="source" :metadata="metadata" @propertyCommitted="formPropsCommitted" ref="radDataForm"></RadDataForm>
        <Button @tap="submitForm" class="bcp m-12 p-16 c-white fs15" v-if="action">{{ action }}</Button>
    </StackLayout>
</template>

<script>
    export default {
        name: "AppForm",
        props: ['fields', 'values', 'action', 'title'],
        data() {
            return {
                commit: 'Immediate', validate: 'Immediate', read: false,
                morph: {label: 'displayName', type: 'editor', values: 'valuesProvider'},
                valProTypes: ['Picker', 'SegmentedEditor', 'List', 'AutoCompleteInline'],
                source:{}, final: {},
            }
        },
        computed: {
            propertyAnnotations() {
                let fields = this.fields, Annotations = [];
                _.forEach(fields, (Obj, name) => {
                    let idx = Annotations.push(this.getPropertyAnnotation(name, Obj)) - 1;
                    Annotations[idx]['index'] = idx;
                });
                return Annotations;
            },
            metadata() {
                return _.zipObject(['isReadOnly', 'commitMode', 'validationMode', 'propertyAnnotations'], [
                    this.read, this.commit, this.validate, this.propertyAnnotations
                ])
            }
        },
        methods: {
            getPropertyAnnotation(name, Obj) {
                let morph = this.morph, Annotation = {name};
                Annotation = _.reduce(Obj, function (Annotation, value, key) {
                    Annotation[_.has(morph, key) ? morph[key] : key] = value;
                    return Annotation;
                }, Annotation);
                return Annotation;
            },
            getInitValue(name) {
                let values = this.values;
                if (values && !_.isEmpty(values) && _.has(values, name)) return values[name];
                return (this.fields && this.fields[name] && _.includes(this.valProTypes, this.fields[name]['type']) && _.isArray(this.fields[name]['values']) && !_.isEmpty(_.isArray(this.fields[name]['values']))) ? 0 : ''
            },
            submitForm(){ this.$refs.radDataForm.nativeView.validateAndCommitAll().then(result => (result) ? this.$emit('submit',this.final) : null) },
            formPropsCommitted(data) {
                let field = data.propertyName, editedObj = JSON.parse(data.object.editedObject), value = _.get(editedObj,field);
                if(this.fields[field].type === 'Picker') value = (value) ? (value.split(':')).shift() : '';
                this.final = Object.assign({},this.final, _.fromPairs([[field,value]])); this.$emit(field,value); this.$emit('final',this.final);
            }
        },
        created(){
            _.forEach(this.fields, (nameObj, name) => { let value = this.getInitValue(name);  this.source[name] = value; this.final[name] = value; });
        }
    }
</script>
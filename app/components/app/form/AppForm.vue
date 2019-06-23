<template>
    <StackLayout>
        <TextTitleSub class="m-15 w-100 text-center" v-if="title">{{ title }}</TextTitleSub>
        <RadDataForm :source="source" :metadata="metadata" @propertyCommitted="formPropsCommitted" ref="radDataForm"></RadDataForm>
        <Button @tap="submitForm" class="bcp m-12 p-16 c-white fs15">{{ action || 'Submit' }}</Button>
    </StackLayout>
</template>

<script>
    import TextTitleSub from "../../typography/TextTitleSub";
    export default {
        name: "AppForm",
        components: {TextTitleSub},
        props: ['fields', 'values', 'action', 'title'],
        data() {
            return {
                commit: 'Immediate', validate: 'Immediate', read: false,
                morph: {label: 'displayName', type: 'editor'},
                valProTypes: ['Picker', 'SegmentedEditor', 'List', 'AutoCompleteInline'],
                final: {},
            }
        },
        computed: {
            source() { return _.mapValues(this.fields, (fldObj, name) => this.getInitValue(name)); },
            propertyAnnotations() {
                let fields = this.fields, values = this.values, Annotations = [];
                _.forEach(fields, (Obj, name) => {
                    let value = _.has(values, name) ? values[name] : null;
                    let idx = Annotations.push(this.getPropertyAnnotation(name, Obj, value)) - 1;
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
            getPropertyAnnotation(name, Obj, value) {
                let morph = this.morph, Annotation = {name}, valProTypes = this.valProTypes;
                Annotation = _.reduce(Obj, function (Annotation, value, key) {
                    Annotation[_.has(morph, key) ? morph[key] : key] = value;
                    return Annotation;
                }, Annotation);
                console.log(name,_.includes(valProTypes, name),!!value);
                if (!!value && _.includes(valProTypes, Obj.type)) Annotation['valuesProvider'] = value;
                return Annotation;
            },
            getInitValue(name, values) {
                values = values || this.values;
                if (!values || _.isEmpty(values) || !_.has(values, name)) return '';
                return (_.isArray(values[name])) ? 0 : values[name];
            },
            submitForm(){ this.$refs.radDataForm.nativeView.validateAndCommitAll().then(result => this.$emit('submit',this.final)) },
            formPropsCommitted(data) {
                let field = data.propertyName, editedObj = JSON.parse(data.object.editedObject), value = _.get(editedObj,field);
                if(this.fields[field].type === 'Picker') value = _.indexOf(this.values[field],value);
                this.final = Object.assign({},this.final, _.fromPairs([[field,value]])); this.$emit(field,value);
            }
        },
        watch: {
            values: { deep: true, immediate: true, handler(data) { _.forEach(this.fields, (nameObj, name) => this.final[name] = this.getInitValue(name, data)); } }
        }
    }
</script>
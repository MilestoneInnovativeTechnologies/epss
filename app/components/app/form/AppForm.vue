<template>
    <StackLayout>
        <TextTitleSub class="m-15 w-100 text-center" v-if="title">{{ title }}</TextTitleSub>
        <RadDataForm :source="source" :metadata="metadata" @propertyCommitted="formPropsCommitted" ref="radDataForm"></RadDataForm>
        <Button @tap="submitForm" class="bcp m-12 p-16 c-white fs15" v-if="action">{{ action }}</Button>
    </StackLayout>
</template>

<script>
    import {PropertyAnnotationValuesProvider} from "../../../assets/scripts/mixins/annotationprovider";

    export default {
        name: "AppForm",
        props: ['fields', 'values', 'action', 'title'],
        mixins: [PropertyAnnotationValuesProvider],
        data() {
            return {
                commit: 'Immediate', validate: 'Immediate', read: false,
                morph: {label: 'displayName', type: 'editor', values: 'valuesProvider'},
                valProTypes: ['Picker', 'SegmentedEditor', 'List', 'AutoCompleteInline'],
                source: {}, final: {},
            }
        },
        computed: {
            propertyAnnotations() {
                let fields = this.fields, Annotations = [];
                _.forEach(fields, (Obj, name) => {
                    Annotations.push(this.getPropertyAnnotation(name, Obj));
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
                return this.pavpValuesPatchedAnnotation(Annotation);
            },
            getInitValue(name) {
                let values = this.values;
                if (values && !_.isEmpty(values) && _.has(values, name) && !_.isNil(values[name])) return values[name];
                return (_.includes(this.valProTypes, _.get(this.fields, [name, 'type']))) ? this.pavpGetAnnotationValueConverted(name) : ''
            },
            submitForm() {
                this.$refs.radDataForm.nativeView.validateAndCommitAll().then(result => (result) ? this.$emit('submit', this.final) : null)
            },
            formPropsCommitted(data) {
                let field = data.propertyName, editedObj = JSON.parse(data.object.editedObject), value = _.get(editedObj, field);
                if (_.includes(this.valProTypes, this.fields[field].type)) value = this.pavpGetAnnotationValueConverted(field, value);
                this.final = Object.assign({}, this.final, _.fromPairs([[field, value]]));
                this.$emit(field, value); this.$emit('final', this.final);
            }
        },
        created() {
            _.forEach(this.fields, (nameObj, name) => { this.source[name] = this.getInitValue(name); });
        },
        mounted() {
            _.forEach(this.fields, (nameObj, name) => { this.final[name] = this.getInitValue(name); });
            this.$emit('final', this.final);
        }
    }
</script>
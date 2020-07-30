<template>
    <StackLayout>
        <TextTitleSub class="m-15 w-100 text-center" v-if="title" :text="title" />
        <RadDataForm :source="source" :metadata="metadata" @propertyCommitted="formPropsCommitted" ref="radDataForm" :key="'rdf_update_' + uKey" />
        <Button @tap="submitForm" class="bcp m-12 p-16 c-white fs15" v-if="action" :text="action" />
    </StackLayout>
</template>

<script>
    const PropertyAnnotationProvider = require("../../../assets/scripts/services/PropertyAnnotationProvider").PropertyAnnotationProvider;
    let PropertyAnnotations = null;

    export default {
        name: "AppForm",
        props: ['fields', 'values', 'action', 'title'],
        data() {
            return {
                source: {}, final: {}, uKey: 0,
            }
        },
        computed: {
            metadata() { return PropertyAnnotations.metadata; },
        },
        methods: {
            getInitValue(name) {
                let values = this.values, initValue = '';
                if (values && !_.isEmpty(values) && _.has(values, name) && !_.isNil(values[name])) initValue = values[name];
                if(_.includes(PropertyAnnotations.valuesProviderTypeEditors, _.get(this.fields, [name, 'type'])))
                    return PropertyAnnotations.GetAnnotationNameConverted(name,initValue);
                return _.isNil(initValue) ? '' : initValue;
            },
            getInitSourceValue(name) {
                let initValue = this.source[name];
                return (_.includes(PropertyAnnotations.valuesProviderTypeEditors, _.get(this.fields, [name, 'type'])))
                    ? PropertyAnnotations.GetAnnotationValueConverted(name, initValue)
                    : initValue;
            },
            submitForm() {
                clickTune.play();
                this.$refs['radDataForm'].nativeView.validateAndCommitAll().then(result => (result) ? this.$emit('submit', this.final) : null)
            },
            formPropsCommitted(data) {
                let field = data.propertyName, editedObj = JSON.parse(data.object.editedObject), value = _.get(editedObj, field);
                if (_.includes(PropertyAnnotations.valuesProviderTypeEditors, this.fields[field].type)) value = PropertyAnnotations.GetAnnotationValueConverted(field, value);
                this.$set(this.final,field,value); emitField(this,field); emitFinal(this);
            }
        },
        watch: {
            values: {
                deep: true, immediate: true,
                handler(){
                    PropertyAnnotations = new PropertyAnnotationProvider(this.fields);
                    let vm = this;
                    _.keys(this.fields).map(field => {
                        vm.$set(vm.source,field,vm.getInitValue(field));
                        vm.$set(vm.final,field,PropertyAnnotations.GetAnnotationValueConverted(field,vm.source[field]));
                    });
                    vm.uKey++; emitFinal(vm);
                }
            }
        }
    }
    function emitField(vm,field){ vm.$emit(field,vm.final[field]) }
    function emitFinal(vm){ vm.$emit('final',vm.final) }
</script>

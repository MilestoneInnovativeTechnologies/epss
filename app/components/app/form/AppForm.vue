<template>
    <StackLayout>
        <TextTitleSub class="m-15 w-100 text-center" v-if="title">{{ title }}</TextTitleSub>
        <RadDataForm :source="source" :metadata="metadata" @propertyCommitted="formPropsCommitted" ref="radDataForm"></RadDataForm>
        <Button @tap="submitForm" class="bcp m-12 p-16 c-white fs15" v-if="action">{{ action }}</Button>
    </StackLayout>
</template>

<script>
    const PropertyAnnotationProvider = require("../../../assets/scripts/services/PropertyAnnotationProvider").PropertyAnnotationProvider;
    const metadata = { isReadOnly:false, commitMode:'Immediate', validationMode:'Immediate' , propertyAnnotations:null };
    let propertyAnnotations;

    export default {
        name: "AppForm",
        props: ['fields', 'values', 'action', 'title'],
        data() {
            return {
                source: {}, final: {},
            }
        },
        computed: {
            metadata() { return propertyAnnotations.metadata; }
        },
        methods: {
            getInitValue(name) {
                let values = this.values, initValue;
                if (values && !_.isEmpty(values) && _.has(values, name) && !_.isNil(values[name])) initValue = values[name];
                if(_.includes(propertyAnnotations.valuesProviderTypeEditors, _.get(this.fields, [name, 'type'])))
                    return propertyAnnotations.GetAnnotationNameConverted(name,initValue);
                return _.isNil(initValue) ? '' : initValue;
            },
            getInitSourceValue(name) {
                let initValue = this.source[name];
                return (_.includes(propertyAnnotations.valuesProviderTypeEditors, _.get(this.fields, [name, 'type'])))
                    ? propertyAnnotations.GetAnnotationValueConverted(name, initValue)
                    : initValue;
            },
            submitForm() {
                this.$refs['radDataForm'].nativeView.validateAndCommitAll().then(result => (result) ? this.$emit('submit', this.final) : null)
            },
            formPropsCommitted(data) {
                let field = data.propertyName, editedObj = JSON.parse(data.object.editedObject), value = _.get(editedObj, field);
                if (_.includes(propertyAnnotations.valuesProviderTypeEditors, this.fields[field].type)) value = propertyAnnotations.GetAnnotationValueConverted(field, value);
                this.$set(this.final,field,value); emitField(this,field); emitFinal(this);
            }
        },
        created() {
            propertyAnnotations = new PropertyAnnotationProvider(this.fields);
            let nObj = Object.create({}), fields = _.keys(this.fields);
            fields.map(field => this.$set(nObj,field,null));
            this.source = Object.assign({},this.source,nObj);
            this.final = Object.assign({},this.final,nObj);
            fields.map(field => this.$set(this.source,field,this.getInitValue(field)));
        },
        mounted() {
            emitFinal = _.debounce(emitFinal,750,{ trailing:true }); emitField = _.debounce(emitField,750,{ trailing:true });
            _.keys(this.fields).map(field => this.$set(this.final,field,this.getInitSourceValue(field))); emitFinal(this);
        }
    }
    function emitField(vm,field){ vm.$emit(field,vm.final[field]) }
    function emitFinal(vm){ vm.$emit('final',vm.final) }
</script>
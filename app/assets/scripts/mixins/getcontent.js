export const getContentComponentOptions = {
    computed: {
        getContent(){ return (content) => (_.isNumber(content) || _.isString(content) || _.isNil(content)) ? content : this.nonTextContent(content) },
        nonTextContent(){ return (content) => _.isArray(content) ? this.arrayContent(content) : this.objectContent(content) },
        arrayContent(){ return (content) => _.isObject(_.head(content)) ? _.map(content,'name').join(', ') : content.join(', ') },
        objectContent(){ return (content) => this.getContent(_.get(content,'name')) },
    }
};
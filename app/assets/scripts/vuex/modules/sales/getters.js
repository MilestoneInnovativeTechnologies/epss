export function customer(state,{ _tableDataFilter,_tableDataByGroup,_tableDataById }) {
    return (customer) => {
        let cusTrans = _tableDataFilter('transactions', 'customer', customer);
        let cusSaleTrans = _.filter(cusTrans,(item) => _.startsWith(item.fncode,'SL'));
        let transDetails = _.pick(_tableDataByGroup('transaction_details','transaction'),_.flatMap(cusSaleTrans,'_ref'));
        let totals = _.mapValues(transDetails,(detArray) => _.sum(_.map(detArray,(arrayItem) => _.toNumber(arrayItem.total))));
        return _.map(cusSaleTrans,(trans) => { return { ...trans,total:_.get(totals,trans._ref) }})
    }
}

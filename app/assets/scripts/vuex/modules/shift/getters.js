export function docno({ dbData,dbTables },getters,{ User }) { return dbData[dbTables[0]].length ? _.get(_.last(dbData[dbTables[0]].filter(({user,end_date}) => (!end_date && user == User.id))),'docno',null) : null }
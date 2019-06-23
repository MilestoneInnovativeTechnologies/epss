export function progressCount({ list }){
    return _.countBy(list,'progress')
}

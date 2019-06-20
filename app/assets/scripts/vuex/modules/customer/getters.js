export function customers({ _data }) {
    return _.filter(_data['users'],(user) => _.startsWith(user.reference,'120201'))
}

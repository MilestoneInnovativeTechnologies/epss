export default {
    clear(state){
        if(_.isArray(state._data.stores)) state._data.stores.splice(0);
        if(_.isArray(state._data.user_store_area)) state._data.user_store_area.splice(0);
    },
};

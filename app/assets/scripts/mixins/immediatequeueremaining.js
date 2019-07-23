import {gap_between_sync_queue_seconds} from "../constants";
import { mapState } from 'vuex';

export const ImmediateQueueRemainingTimeMixin = {
    data(){ return {
        queueRemainingTime: 0,
        immediateQueueFinished: false,
    }},
    computed: {
        ...mapState('Sync',{syncQueueTimeIndex:'queue_index'}),
    },
    methods: {
        getQueueRemainingTime(queue){ return _.reduce(queue,(prev,next) => ((tInt(next) - tInt(prev)) > gap_between_sync_queue_seconds) ? tInt(prev) : tInt(next),queue[0]) - tInt(new Date().getTime() / 1000) },
    },
    watch: {
        syncQueueTimeIndex(queue){
            if(tInt(queue[0]) - tInt(new Date().getTime() / 1000) > gap_between_sync_queue_seconds){
                this.immediateQueueFinished = true;
                this.queueRemainingTime = 0;
            } else {
                this.queueRemainingTime = this.getQueueRemainingTime(queue);
                this.immediateQueueFinished = false;
            }
        }
    }
};
function tInt(n){ return _.toSafeInteger(n) }
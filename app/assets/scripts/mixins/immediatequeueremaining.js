import { gap_between_sync_queue_seconds,approx_time_for_a_sync } from './../constants';
import { mapState } from 'vuex';

export const ImmediateQueueRemainingTimeMixin = {
    data(){ return {
        queueRemainingTime: 0,
        immediateQueueFinished: false,
        queueBatchLastItem: null,
    }},
    computed: {
        ...mapState('Sync',{syncQueueTimeIndex:'queue_index'}),
        queueRemainingItems(){ return this.syncQueueTimeIndex.indexOf(this.queueBatchLastItem) }
    },
    methods: {
        getQueueRemainingTime(queue){ return this.getBatchLastQueueItem(queue) - now() },
        getBatchLastQueueItem(Q){ let P = now(); for(let x in Q) if(tInt(Q[x] - P) > gap_between_sync_queue_seconds+1) return P; else P = Q[x]; return tInt(_.last(Q)) },
    },
    watch: {
        syncQueueTimeIndex(queue){
            let fstTime = tInt(queue[0]), lstTime = this.queueBatchLastItem || (this.queueBatchLastItem = this.getBatchLastQueueItem(queue)), tmeRemaining = lstTime - now();
            if(fstTime <= lstTime){
                this.immediateQueueFinished = false;
                this.queueRemainingTime = (tmeRemaining < 0) ? (approx_time_for_a_sync * (queue.indexOf(lstTime)+1)) : tmeRemaining;
            } else {
                this.immediateQueueFinished = true;
                this.queueRemainingTime = 0;
            }
        }
    }
};
function tInt(n){ return _.toSafeInteger(n) }
function now(){ return parseInt(new Date().getTime()/1000) }
<template>
    <Page actionBarHidden="true" backgroundSpanUnderStatusBar="true">
        <StackLayout>
            <AppButton @tap.native="$navigateTo(require('./../Home').default)">Back to Home</AppButton>
            <GridLayout :rows="rows" columns="*" width="90%">
                <GridLayout :row="idx" col="0" rows="auto" columns="auto,3*,*" v-for="(text,item,idx) in items" :key="'dc-'+idx">
                    <TextNormal col="0" :text="idx+1+'. '" verticalAlignment="middle" class="p-r-16" />
                    <TextNormal col="1" :text="text" textWrap="true" verticalAlignment="middle" />
                    <AppButton col="2" @tap.native="goTo(item)" text="GO" height="50" />
                </GridLayout>
            </GridLayout>
            <AppButton @tap.native="DDB">Download DB Backup</AppButton>
        </StackLayout>
    </Page>
</template>

<script>
import {File, path} from "@nativescript/core/file-system";
    import {StoragePermission} from "../../assets/scripts/mixins/storagepermission";

    export default {
        name: "DebugIndex",
        mixins: [StoragePermission],
        data() { return {
            items: {
                One: 'DB Records Count',
                Two: 'Upload Logs',
                Six: 'Pending Uploads',
                Three: 'Download Logs',
                Four: 'View Table Records',
                Five: 'View Logs',
            }
        } },
        computed: {
            rows(){ return Array(_.keys(this.items).length).fill('auto').join(',') },
        },
        methods: {
            goTo(item){ return this.$navigateTo(require('./Debug' + item + '.vue').default) },
            async DDB(){
                if(!await this.StoragePermission()) return;
                let fileName = ['DB',__.now(),'epss.db'].join('.'), destination = path.join(android.os.Environment.getExternalStorageDirectory().getAbsolutePath().toString(),'epss',fileName);
                File.fromPath(DB.dbFile).read().then(txt => File.fromPath(destination).write(txt).then(() => alert('Successfully saved file!!')).catch(() => alert('Saving file failed!!'))).catch(() => alert('Reading file failed!!'))
            },

        }
    }
</script>

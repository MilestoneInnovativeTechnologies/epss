import { NativeScriptConfig } from '@nativescript/core'

export default {
  id: 'net.milestoneit.epss',
  appPath: 'src',
  appResourcesPath: 'App_Resources',
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none'
  }
} as NativeScriptConfig

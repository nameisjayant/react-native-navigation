package com.nameisjayant.reactnativenavigation

import com.facebook.react.bridge.ReactApplicationContext

class ReactNativeNavigationModule(reactContext: ReactApplicationContext) :
  NativeReactNativeNavigationSpec(reactContext) {

  override fun multiply(a: Double, b: Double): Double {
    return a * b
  }

  companion object {
    const val NAME = NativeReactNativeNavigationSpec.NAME
  }
}

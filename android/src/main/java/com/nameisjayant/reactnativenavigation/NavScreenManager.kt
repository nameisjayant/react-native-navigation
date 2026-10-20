package com.nameisjayant.reactnativenavigation

import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.RNNavScreenManagerDelegate
import com.facebook.react.viewmanagers.RNNavScreenManagerInterface

@ReactModule(name = NavScreenManager.NAME)
class NavScreenManager :
  ViewGroupManager<NavScreenView>(),
  RNNavScreenManagerInterface<NavScreenView> {

  private val delegate = RNNavScreenManagerDelegate(this)

  override fun getDelegate(): ViewManagerDelegate<NavScreenView> = delegate

  override fun getName(): String = NAME

  override fun createViewInstance(context: ThemedReactContext) = NavScreenView(context)

  override fun setScreenKey(view: NavScreenView, value: String?) {
    view.screenKey = value
  }

  companion object {
    const val NAME = "RNNavScreen"
  }
}

package com.nameisjayant.reactnativenavigation

import android.view.View
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.RNNavigationContainerManagerDelegate
import com.facebook.react.viewmanagers.RNNavigationContainerManagerInterface

@ReactModule(name = NavigationContainerManager.NAME)
class NavigationContainerManager :
  ViewGroupManager<NavigationContainerView>(),
  RNNavigationContainerManagerInterface<NavigationContainerView> {

  private val delegate = RNNavigationContainerManagerDelegate(this)

  override fun getDelegate(): ViewManagerDelegate<NavigationContainerView> = delegate

  override fun getName(): String = NAME

  override fun createViewInstance(context: ThemedReactContext) = NavigationContainerView(context)

  override fun setStack(view: NavigationContainerView, value: ReadableArray?) {
    val keys = (0 until (value?.size() ?: 0)).mapNotNull { value?.getString(it) }
    view.setStack(keys)
  }

  // Children are screens, laid out by Compose instead of React Native.

  override fun needsCustomLayoutForChildren(): Boolean = true

  override fun addView(parent: NavigationContainerView, child: View, index: Int) {
    require(child is NavScreenView) {
      "RNNavigationContainer only accepts RNNavScreen children"
    }
    parent.addScreen(child, index)
  }

  override fun removeViewAt(parent: NavigationContainerView, index: Int) {
    parent.removeScreenAt(index)
  }

  override fun getChildCount(parent: NavigationContainerView): Int = parent.getScreenCount()

  override fun getChildAt(parent: NavigationContainerView, index: Int): View? =
    parent.getScreenAt(index)

  override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> =
    (super.getExportedCustomDirectEventTypeConstants() ?: mutableMapOf()).apply {
      put(NavigationEvent.BACK, mapOf("registrationName" to "onBack"))
      put(
        NavigationEvent.ATTACHED_SCREENS_CHANGE,
        mapOf("registrationName" to "onAttachedScreensChange"),
      )
    }

  companion object {
    const val NAME = "RNNavigationContainer"
  }
}

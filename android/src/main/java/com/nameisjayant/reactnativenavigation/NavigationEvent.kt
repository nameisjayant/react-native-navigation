package com.nameisjayant.reactnativenavigation

import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event

class NavigationEvent(
  surfaceId: Int,
  viewTag: Int,
  private val name: String,
  private val payload: WritableMap,
) : Event<NavigationEvent>(surfaceId, viewTag) {

  override fun getEventName(): String = name

  override fun getEventData(): WritableMap = payload

  override fun canCoalesce(): Boolean = false

  companion object {
    const val BACK = "topBack"
    const val ATTACHED_SCREENS_CHANGE = "topAttachedScreensChange"
  }
}

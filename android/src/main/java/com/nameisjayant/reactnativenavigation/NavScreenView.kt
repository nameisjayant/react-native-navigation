package com.nameisjayant.reactnativenavigation

import android.content.Context
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import com.facebook.react.views.view.ReactViewGroup

/**
 * A single screen rendered by React. Its children are managed by Fabric, while
 * the view itself is placed inside a Navigation 3 `NavEntry` by
 * [NavigationContainerView].
 */
class NavScreenView(context: Context) : ReactViewGroup(context) {
  /** Backed by Compose state so entries recompose once the key is known. */
  var screenKey: String? by mutableStateOf(null)
}

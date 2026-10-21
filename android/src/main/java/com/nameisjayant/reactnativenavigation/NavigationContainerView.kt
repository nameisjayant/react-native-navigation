package com.nameisjayant.reactnativenavigation

import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.runtime.snapshotFlow
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.ComposeView
import androidx.compose.ui.platform.ViewCompositionStrategy
import androidx.compose.ui.viewinterop.AndroidView
import androidx.navigation3.runtime.NavEntry
import androidx.navigation3.ui.NavDisplay
import androidx.navigationevent.NavigationEventDispatcherOwner
import androidx.navigationevent.compose.LocalNavigationEventDispatcherOwner
import androidx.navigationevent.compose.rememberNavigationEventDispatcherOwner
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import kotlinx.coroutines.flow.distinctUntilChanged

/**
 * Hosts a Jetpack Compose Navigation 3 [NavDisplay]. JS owns the back stack and
 * sends it through [setStack]; each entry renders the [NavScreenView] whose
 * `screenKey` matches.
 */
class NavigationContainerView(private val reactContext: ThemedReactContext) :
  FrameLayout(reactContext) {

  /** Screen views added by Fabric, in React child order. */
  private val screens = mutableStateListOf<NavScreenView>()

  /** Keys of the back stack, last one is visible. */
  private val stack = mutableStateListOf<String>()

  /** Keys of entries currently composed (visible or animating), ref counted. */
  private val attached = mutableStateMapOf<String, Int>()

  /** False while JS wants back left to a nested container (or none). */
  var backEnabled by mutableStateOf(true)

  init {
    val composeView = ComposeView(reactContext).apply {
      setViewCompositionStrategy(ViewCompositionStrategy.DisposeOnDetachedFromWindow)
      setContent { NavigationContent() }
    }
    addView(composeView, LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT))
  }

  fun setStack(keys: List<String>) {
    if (keys == stack.toList()) return
    stack.clear()
    stack.addAll(keys)
  }

  // Fabric children. They are not added to this ViewGroup directly; Compose
  // attaches them inside the matching NavEntry.

  fun addScreen(screen: NavScreenView, index: Int) = screens.add(index, screen)

  fun removeScreenAt(index: Int) {
    screens.removeAt(index).detach()
  }

  fun getScreenCount(): Int = screens.size

  fun getScreenAt(index: Int): NavScreenView? = screens.getOrNull(index)

  @Composable
  private fun NavigationContent() {
    LaunchedEffect(Unit) {
      snapshotFlow { attached.keys.toList() }
        .distinctUntilChanged()
        .collect { keys -> dispatchAttachedScreensChange(keys) }
    }

    val backStack = stack.toList()
    if (backStack.isEmpty()) return

    // A bare ComposeView does not provide a back event dispatcher, which
    // NavDisplay requires; use a child of the host activity's. Each container,
    // nested ones included, gets its own so JS can switch it off on its own.
    val activityOwner = reactContext.currentActivity as? NavigationEventDispatcherOwner ?: return
    val dispatcherOwner =
      rememberNavigationEventDispatcherOwner(enabled = backEnabled, parent = activityOwner)

    CompositionLocalProvider(LocalNavigationEventDispatcherOwner provides dispatcherOwner) {
      NavDisplay(
        backStack = backStack,
        modifier = Modifier.fillMaxSize(),
        onBack = { dispatchBack() },
        entryProvider = { screenKey ->
          NavEntry(screenKey) { ScreenEntry(screenKey) }
        },
      )
    }
  }

  @Composable
  private fun ScreenEntry(screenKey: String) {
    DisposableEffect(screenKey) {
      attached[screenKey] = (attached[screenKey] ?: 0) + 1
      onDispose {
        val count = (attached[screenKey] ?: 1) - 1
        if (count <= 0) attached.remove(screenKey) else attached[screenKey] = count
      }
    }

    val screen = screens.firstOrNull { it.screenKey == screenKey } ?: return
    key(screen) {
      AndroidView(
        modifier = Modifier.fillMaxSize(),
        factory = {
          // A view can only have one parent; detach it from a previous entry.
          screen.apply { detach() }
        },
      )
    }
  }

  private fun dispatchBack() {
    dispatchEvent(NavigationEvent.BACK, Arguments.createMap())
  }

  private fun dispatchAttachedScreensChange(keys: List<String>) {
    val payload = Arguments.createMap().apply {
      putArray("keys", Arguments.fromList(keys))
    }
    dispatchEvent(NavigationEvent.ATTACHED_SCREENS_CHANGE, payload)
  }

  private fun dispatchEvent(name: String, payload: WritableMap) {
    UIManagerHelper.getEventDispatcher(reactContext)
      ?.dispatchEvent(
        NavigationEvent(UIManagerHelper.getSurfaceId(reactContext), id, name, payload)
      )
  }

  // React Native does not run Android layout passes for native children, so
  // measure and lay out the Compose hierarchy ourselves when it asks for it.

  private val measureAndLayout = Runnable {
    if (!isAttachedToWindow) return@Runnable
    measure(
      MeasureSpec.makeMeasureSpec(width, MeasureSpec.EXACTLY),
      MeasureSpec.makeMeasureSpec(height, MeasureSpec.EXACTLY),
    )
    layout(left, top, right, bottom)
  }

  override fun requestLayout() {
    super.requestLayout()
    post(measureAndLayout)
  }

  // Lay out what was skipped in onMeasure while detached.
  override fun onAttachedToWindow() {
    super.onAttachedToWindow()
    post(measureAndLayout)
  }

  override fun onLayout(changed: Boolean, l: Int, t: Int, r: Int, b: Int) {
    for (i in 0 until childCount) {
      getChildAt(i).layout(0, 0, r - l, b - t)
    }
  }

  override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
    val width = MeasureSpec.getSize(widthMeasureSpec)
    val height = MeasureSpec.getSize(heightMeasureSpec)
    setMeasuredDimension(width, height)
    // Measuring a detached ComposeView makes it create its composition, which
    // needs a window. Fabric measures every view it lays out, including a
    // nested container whose screen is not yet placed in a NavEntry.
    if (!isAttachedToWindow) return
    for (i in 0 until childCount) {
      getChildAt(i).measure(
        MeasureSpec.makeMeasureSpec(width, MeasureSpec.EXACTLY),
        MeasureSpec.makeMeasureSpec(height, MeasureSpec.EXACTLY),
      )
    }
  }

  private fun View.detach() {
    (parent as? ViewGroup)?.removeView(this)
  }
}

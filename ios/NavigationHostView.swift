import SwiftUI
import UIKit

/**
 * Hosts a SwiftUI [NavigationStack]. JS owns the back stack and sends it
 * through `setStack`; each entry renders the React screen view whose
 * `screenKey` matches.
 */
@objc(RNNavigationHostView)
public final class NavigationHostView: UIView {
  private let model = NavigationModel()
  private lazy var hostingController: UIHostingController<NavigationRootView> = {
    let controller = UIHostingController(rootView: NavigationRootView(model: model))
    controller.view.backgroundColor = .clear
    // React lays out the screens itself, edge to edge.
    if #available(iOS 16.4, *) {
      controller.safeAreaRegions = []
    }
    return controller
  }()

  /** Called with the key of a screen the user popped natively (swipe back). */
  @objc public var onPop: ((String) -> Void)? {
    get { model.onPop }
    set { model.onPop = newValue }
  }

  /**
   * Called whenever the set of screens currently in the SwiftUI hierarchy
   * (visible or animating) changes.
   */
  @objc public var onAttachedScreensChange: (([String]) -> Void)? {
    get { model.onAttachedScreensChange }
    set { model.onAttachedScreensChange = newValue }
  }

  /** False while JS wants back left to a nested container (or none). */
  @objc public var backEnabled: Bool {
    get { model.backEnabled }
    set { model.backEnabled = newValue }
  }

  public override init(frame: CGRect) {
    super.init(frame: frame)
    addSubview(hostingController.view)
  }

  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  @objc public func setStack(_ keys: [String]) {
    if keys == model.stack { return }
    model.stack = keys
  }

  // Fabric children. They are not added to this view directly; SwiftUI
  // attaches them inside the matching navigation entry.

  @objc public func mountScreen(_ screen: UIView, key: String) {
    model.screens[key] = screen
  }

  @objc public func unmountScreen(_ screen: UIView) {
    if let key = model.screens.first(where: { $0.value === screen })?.key {
      model.screens.removeValue(forKey: key)
    }
    screen.removeFromSuperview()
  }

  // The hosting controller needs a parent view controller for appearance
  // callbacks and for its navigation controller to work.

  public override func didMoveToWindow() {
    super.didMoveToWindow()
    if window == nil {
      hostingController.willMove(toParent: nil)
      hostingController.removeFromParent()
      return
    }
    guard hostingController.parent == nil, let parent = parentViewController else { return }
    parent.addChild(hostingController)
    hostingController.didMove(toParent: parent)
  }

  public override func layoutSubviews() {
    super.layoutSubviews()
    hostingController.view.frame = bounds
  }

  private var parentViewController: UIViewController? {
    var responder: UIResponder? = superview
    while let current = responder {
      if let controller = current as? UIViewController { return controller }
      responder = current.next
    }
    return nil
  }
}

/** Back stack state shared between the UIKit host and the SwiftUI views. */
final class NavigationModel: ObservableObject {
  /** Keys of the back stack, last one is visible. */
  @Published var stack: [String] = []

  /** Screen views added by Fabric, by key. */
  @Published var screens: [String: UIView] = [:]

  var backEnabled = true {
    didSet { popGesture.isEnabled = backEnabled }
  }

  var onPop: ((String) -> Void)?
  var onAttachedScreensChange: (([String]) -> Void)?

  let popGesture = PopGestureDelegate()

  /** Keys of entries currently in the hierarchy, ref counted. */
  private var attached: [String: Int] = [:]
  private var reportedAttached: [String]?
  private var reportScheduled = false

  /** The path of `NavigationStack`: every entry above the root. */
  var path: Binding<[String]> {
    Binding(
      get: { Array(self.stack.dropFirst()) },
      set: { newPath in
        let current = Array(self.stack.dropFirst())
        // Only a native pop changes the path from SwiftUI's side.
        guard newPath.count < current.count, Array(current.prefix(newPath.count)) == newPath
        else { return }
        self.stack = Array(self.stack.prefix(newPath.count + 1))
        // Tell JS, top first, so it pops the same entries.
        for key in current[newPath.count...].reversed() {
          self.onPop?(key)
        }
      }
    )
  }

  func attach(_ key: String) {
    attached[key, default: 0] += 1
    scheduleAttachedReport()
  }

  func detach(_ key: String) {
    let count = (attached[key] ?? 1) - 1
    if count <= 0 { attached.removeValue(forKey: key) } else { attached[key] = count }
    scheduleAttachedReport()
  }

  // Called while SwiftUI updates views; report once it is done.
  private func scheduleAttachedReport() {
    if reportScheduled { return }
    reportScheduled = true
    DispatchQueue.main.async { [weak self] in
      guard let self else { return }
      self.reportScheduled = false
      let keys = self.attached.keys.sorted()
      if keys == self.reportedAttached { return }
      self.reportedAttached = keys
      self.onAttachedScreensChange?(keys)
    }
  }
}

/**
 * Hiding the navigation bar turns off the swipe back gesture; this brings it
 * back and lets JS switch it off on its own, nested containers included.
 */
final class PopGestureDelegate: NSObject, UIGestureRecognizerDelegate {
  weak var navigationController: UINavigationController?
  var isEnabled = true

  func install(on navigationController: UINavigationController) {
    if self.navigationController === navigationController { return }
    self.navigationController = navigationController
    navigationController.interactivePopGestureRecognizer?.delegate = self
    if #available(iOS 26.0, *) {
      navigationController.interactiveContentPopGestureRecognizer?.delegate = self
    }
  }

  func gestureRecognizerShouldBegin(_ gestureRecognizer: UIGestureRecognizer) -> Bool {
    isEnabled && (navigationController?.viewControllers.count ?? 0) > 1
  }
}

struct NavigationRootView: View {
  @ObservedObject var model: NavigationModel

  var body: some View {
    if let root = model.stack.first {
      NavigationStack(path: model.path) {
        entry(root)
          // A new root (replace on the root screen) is a new entry.
          .id(root)
          .background(
            NavigationControllerReader { model.popGesture.install(on: $0) }
          )
          .navigationDestination(for: String.self) { entry($0) }
      }
    }
  }

  private func entry(_ key: String) -> some View {
    ScreenEntry(key: key, model: model)
      .ignoresSafeArea()
      .background(Color(uiColor: .systemBackground))
      .toolbar(.hidden, for: .navigationBar)
  }
}

/** Places the React screen view for `key` inside a navigation entry. */
struct ScreenEntry: UIViewRepresentable {
  let key: String
  @ObservedObject var model: NavigationModel

  final class Coordinator {
    let key: String
    let model: NavigationModel

    init(key: String, model: NavigationModel) {
      self.key = key
      self.model = model
    }
  }

  func makeCoordinator() -> Coordinator {
    Coordinator(key: key, model: model)
  }

  func makeUIView(context: Context) -> ScreenContainerView {
    model.attach(key)
    return ScreenContainerView()
  }

  func updateUIView(_ view: ScreenContainerView, context: Context) {
    view.screen = model.screens[key]
  }

  static func dismantleUIView(_ view: ScreenContainerView, coordinator: Coordinator) {
    view.screen = nil
    coordinator.model.detach(coordinator.key)
  }
}

final class ScreenContainerView: UIView {
  var screen: UIView? {
    didSet {
      if let oldValue, oldValue !== screen, oldValue.superview === self {
        oldValue.removeFromSuperview()
      }
      // A view can only have one parent; this moves it from a previous entry.
      if let screen, screen.superview !== self {
        addSubview(screen)
        setNeedsLayout()
      }
    }
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    screen?.frame = bounds
  }
}

/** Finds the `UINavigationController` backing a `NavigationStack`. */
struct NavigationControllerReader: UIViewControllerRepresentable {
  let onResolve: (UINavigationController) -> Void

  final class ReaderController: UIViewController {
    var onResolve: ((UINavigationController) -> Void)?

    override func didMove(toParent parent: UIViewController?) {
      super.didMove(toParent: parent)
      resolve()
    }

    override func viewWillAppear(_ animated: Bool) {
      super.viewWillAppear(animated)
      resolve()
    }

    private func resolve() {
      if let navigationController { onResolve?(navigationController) }
    }
  }

  func makeUIViewController(context: Context) -> ReaderController {
    let controller = ReaderController()
    controller.view.isUserInteractionEnabled = false
    controller.onResolve = onResolve
    return controller
  }

  func updateUIViewController(_ controller: ReaderController, context: Context) {
    controller.onResolve = onResolve
  }
}

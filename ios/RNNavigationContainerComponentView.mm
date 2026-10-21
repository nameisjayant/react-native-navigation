#import "RNNavigationContainerComponentView.h"
#import "RNNavScreenComponentView.h"

#import <react/renderer/components/ReactNativeNavigationSpec/ComponentDescriptors.h>
#import <react/renderer/components/ReactNativeNavigationSpec/EventEmitters.h>
#import <react/renderer/components/ReactNativeNavigationSpec/Props.h>
#import <react/renderer/components/ReactNativeNavigationSpec/RCTComponentViewHelpers.h>

#if __has_include(<ReactNativeNavigation/ReactNativeNavigation-Swift.h>)
#import <ReactNativeNavigation/ReactNativeNavigation-Swift.h>
#else
#import "ReactNativeNavigation-Swift.h"
#endif

using namespace facebook::react;

@implementation RNNavigationContainerComponentView {
  RNNavigationHostView *_hostView;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNNavigationContainerComponentDescriptor>();
}

// The SwiftUI hierarchy holds the back stack; never hand it out again.
+ (BOOL)shouldBeRecycled
{
  return NO;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNNavigationContainerProps>();
    _props = defaultProps;

    _hostView = [[RNNavigationHostView alloc] initWithFrame:frame];
    __weak RNNavigationContainerComponentView *weakSelf = self;
    _hostView.onPop = ^(NSString *key) {
      [weakSelf dispatchPop:key];
    };
    _hostView.onAttachedScreensChange = ^(NSArray<NSString *> *keys) {
      [weakSelf dispatchAttachedScreensChange:keys];
    };
    self.contentView = _hostView;
  }
  return self;
}

- (void)updateProps:(const Props::Shared &)props oldProps:(const Props::Shared &)oldProps
{
  const auto &newProps = *std::static_pointer_cast<const RNNavigationContainerProps>(props);

  NSMutableArray<NSString *> *keys = [NSMutableArray arrayWithCapacity:newProps.stack.size()];
  for (const auto &key : newProps.stack) {
    [keys addObject:[NSString stringWithUTF8String:key.c_str()]];
  }
  [_hostView setStack:keys];
  _hostView.backEnabled = newProps.backEnabled;

  [super updateProps:props oldProps:oldProps];
}

// Children are screens, placed by SwiftUI instead of React Native.

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  RCTAssert(
      [childComponentView isKindOfClass:RNNavScreenComponentView.class],
      @"RNNavigationContainer only accepts RNNavScreen children");
  RNNavScreenComponentView *screen = (RNNavScreenComponentView *)childComponentView;
  [_hostView mountScreen:screen key:screen.screenKey ?: @""];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [_hostView unmountScreen:childComponentView];
}

- (void)dispatchPop:(NSString *)key
{
  if (!_eventEmitter) {
    return;
  }
  std::static_pointer_cast<const RNNavigationContainerEventEmitter>(_eventEmitter)
      ->onPop(RNNavigationContainerEventEmitter::OnPop{.key = std::string(key.UTF8String)});
}

- (void)dispatchAttachedScreensChange:(NSArray<NSString *> *)keys
{
  if (!_eventEmitter) {
    return;
  }
  std::vector<std::string> payload;
  payload.reserve(keys.count);
  for (NSString *key in keys) {
    payload.emplace_back(key.UTF8String);
  }
  std::static_pointer_cast<const RNNavigationContainerEventEmitter>(_eventEmitter)
      ->onAttachedScreensChange(RNNavigationContainerEventEmitter::OnAttachedScreensChange{.keys = payload});
}

@end

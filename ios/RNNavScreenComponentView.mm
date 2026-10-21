#import "RNNavScreenComponentView.h"

#import <react/renderer/components/ReactNativeNavigationSpec/ComponentDescriptors.h>
#import <react/renderer/components/ReactNativeNavigationSpec/Props.h>
#import <react/renderer/components/ReactNativeNavigationSpec/RCTComponentViewHelpers.h>

using namespace facebook::react;

@implementation RNNavScreenComponentView

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNNavScreenComponentDescriptor>();
}

// The container keeps track of its screens; never hand one out again.
+ (BOOL)shouldBeRecycled
{
  return NO;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNNavScreenProps>();
    _props = defaultProps;
  }
  return self;
}

- (void)updateProps:(const Props::Shared &)props oldProps:(const Props::Shared &)oldProps
{
  const auto &newProps = *std::static_pointer_cast<const RNNavScreenProps>(props);
  _screenKey = [NSString stringWithUTF8String:newProps.screenKey.c_str()];
  [super updateProps:props oldProps:oldProps];
}

@end

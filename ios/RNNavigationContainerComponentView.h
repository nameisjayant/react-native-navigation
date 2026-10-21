#import <React/RCTViewComponentView.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * Hosts a SwiftUI NavigationStack (RNNavigationHostView). JS owns the back
 * stack; screens mounted by Fabric are handed to the host instead of being
 * added as subviews.
 */
@interface RNNavigationContainerComponentView : RCTViewComponentView
@end

NS_ASSUME_NONNULL_END

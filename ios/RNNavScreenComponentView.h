#import <React/RCTViewComponentView.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * A single screen rendered by React. Its children are managed by Fabric, while
 * the view itself is placed inside a SwiftUI navigation entry by
 * RNNavigationContainerComponentView.
 */
@interface RNNavScreenComponentView : RCTViewComponentView

@property (nonatomic, copy, readonly, nullable) NSString *screenKey;

@end

NS_ASSUME_NONNULL_END

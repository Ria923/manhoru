#import "AppDelegate.h"
#import <GoogleMaps/GoogleMaps.h>

#import <React/RCTBundleURLProvider.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [GMSServices provideAPIKey:@"YOUR_API_KEY_HERE"]; // ここにAPIキーを設定してください
  // ... existing code ...
  return YES;
}

// ... existing code ... 
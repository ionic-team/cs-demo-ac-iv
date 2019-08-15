import { Injectable } from '@angular/core';
import { IonicAuth, IonicAuthOptions } from '@ionic-enterprise/auth';
import { IdentityService } from '../identity';
import { User } from '../../models/user';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

const cordovaAzureConfig: IonicAuthOptions = {
  // client or application id for provider
  clientID: 'b69e2ee7-b67a-4e26-8a38-f7ca30d2e4d4',
  // This is the expected redirectUri from the login page.
  redirectUri: 'myapp://callback',
  // requested scopes from provider
  scope: 'openid offline_access email profile https://vikingsquad.onmicrosoft.com/api/Hello.Read',
  // The discovery url for the provider
  discoveryUrl: 'https://vikingsquad.b2clogin.com/vikingsquad.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=B2C_1_Signup_Signin',
  // The audience if applicable
  audience: 'https://api.myapp.com',
  // The expected logout url
  logoutUrl: 'myapp://callback?logout=true',
  // The platform which we are running on
  platform: 'cordova',
  // The type of iOS webview to use. 'shared' will use a webview that can share session/cookies
  // on iOS to provide SSO across multiple apps but will cause a prompt for the user which asks them
  // to confirm they want to share site data with the app. 'private' uses a webview which will not
  // prompt the user but will not be able to share session/cookie data either for true SSO across
  // multiple apps.
  iosWebView: 'private',
  // The auth provider.
  authConfig: 'azure',
  // This sets the color of the toolbar at the top of the login webview for android.
  //  Red is just to call attention to what is being set (you don't want to use Red)
  androidToolbarColor: 'Red'
};

const webAzureConfig: IonicAuthOptions = {
  // client or application id for provider
  clientID: 'b69e2ee7-b67a-4e26-8a38-f7ca30d2e4d4',
  // This is the expected redirectUri from the login page.
  redirectUri: 'http://localhost:8100/login',
  // requested scopes from provider
  scope: 'openid offline_access email profile https://vikingsquad.onmicrosoft.com/api/Hello.Read',
  // The discovery url for the provider
  discoveryUrl: 'https://vikingsquad.b2clogin.com/vikingsquad.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=B2C_1_Signup_Signin',
  // The audience if applicable
  audience: 'https://api.myapp.com',
  // The expected logout url
  logoutUrl: 'http://localhost:8100/login',
  // The platform which we are running on
  platform: 'web',
  // The auth provider.
  authConfig: 'azure'
};
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService  extends IonicAuth {
  private user: User;
  private identity: IdentityService;
  private router: Router;

  // @ts-ignore
  constructor (
    identity: IdentityService,
    router: Router,
    plt: Platform,
  ) {
    const isCordovaApp = plt.is('cordova');
    const config = isCordovaApp ? cordovaAzureConfig : webAzureConfig;
    config.tokenStorageProvider = identity;
    super(config);
    this.identity = identity;
    this.router = router;
    this.identity.get().subscribe(u => (this.user = u));
  }

  async login() {
      // logout to clear previously stored identity before new login
      await this.identity.remove();

      // set the desired auth mode
      await this.identity.setDesiredAuthMode();

      // login with auth service
      try {
        await super.login();
      }
      catch(err) {
        // This is to handle the password reset case for Azure AD
        //  This only applicable to Azure AD.
        console.log('login error: ' + JSON.stringify(err));
        const message: string = err.message;
        // This is the error code returned by the Azure AD servers on failure.
        if (message !== undefined && message.startsWith('AADB2C90118')) {
            // The address you pass back is the custom user flow (policy) endpoint
            await super.login('https://vikingsquad.b2clogin.com/vikingsquad.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=B2C_1_password_reset');
        } else {
          throw new Error(err.error);
        }
      }
  }

  async isAuthenticated() {
    // Check that the vault is unlocked before checking if the user is authenticated
    // you could also automatically attempt to unlock the vault if desired
    const isVaultLocked = await this.identity.isLocked();
    const isAuthed = !isVaultLocked && await super.isAuthenticated();
    if (isAuthed && this.user === undefined) {
      // if the user is authed but we've there is not identity restore it
      this.identity.set(await this.getUserInfo());
    }
    return isAuthed;
  }

  async onLoginSuccess(response: any) {
    // grab the info about the user from tokens
    const userInfo = await this.getUserInfo();

    // set the user identity
    await this.identity.set(userInfo);
  }

  async onLogout() {
    await this.identity.remove();
    this.router.navigate(['login']);
  }

  async getUserInfo(): Promise<User | undefined> {
    const idToken = await this.getIdToken();
    if (!idToken) {
      return;
    }

    let email = idToken.email;
    if (idToken.emails instanceof Array) {
      email = idToken.emails[0];
    }

    return {
      id: idToken.sub,
      email: email,
      firstName: idToken.firstName,
      lastName: idToken.lastName,
    };
  }
}

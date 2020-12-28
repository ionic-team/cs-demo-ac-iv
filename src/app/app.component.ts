import { Component } from '@angular/core';

import { NavController } from '@ionic/angular';
import { AuthenticationService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  constructor(
    private auth: AuthenticationService,
    private navController: NavController,
  ) {
    this.auth.changed.subscribe(authenticated =>
      this.handleAuthChange(authenticated),
    );
  }

  private handleAuthChange(authenticated: boolean) {
    if (authenticated) {
      this.navController.navigateRoot(['tabs', 'home']);
    } else {
      this.navController.navigateRoot(['login']);
    }
  }
}

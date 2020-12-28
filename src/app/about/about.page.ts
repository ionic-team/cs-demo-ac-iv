import { Component, OnInit } from '@angular/core';
import { AuthMode } from '@ionic-enterprise/identity-vault';

import { dependencies } from '../../../package.json';

import { AuthenticationService, VaultService } from '@app/services';
import { User } from '@app/models';

@Component({
  selector: 'app-about',
  templateUrl: 'about.page.html',
  styleUrls: ['about.page.scss'],
})
export class AboutPage implements OnInit {
  angularVersion: string;
  authConnectVersion: string;
  capacitorVersion: string;
  frameworkVersion: string;
  identityVaultVersion: string;

  user: User;
  authMode: string;
  bioType: string;

  constructor(
    private authentication: AuthenticationService,
    private vaultService: VaultService,
  ) {}

  async ionViewDidEnter() {
    this.user = await this.authentication.getUserInfo();
    this.authMode = AuthMode[await this.vaultService.getAuthMode()];
    this.bioType = await this.vaultService.supportedBiometricTypes();
  }

  ngOnInit() {
    const verSpec = /[\^~]/;
    this.angularVersion = dependencies['@angular/core'].replace(verSpec, '');
    this.authConnectVersion = dependencies['@ionic-enterprise/auth'].replace(
      verSpec,
      '',
    );
    //this.capacitorVersion = dependencies['@capacitor/core'].replace(
    //  verSpec,
    //  '',
    //);
    this.frameworkVersion = dependencies['@ionic/angular'].replace(verSpec, '');
    this.identityVaultVersion = dependencies[
      '@ionic-enterprise/identity-vault'
    ].replace(verSpec, '');
  }

  logout() {
    this.authentication.logout();
  }
}

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NavController, Platform } from '@ionic/angular';

import { AppComponent } from './app.component';
import { VaultService } from './services/vault/vault.service';
import { createVaultServiceMock } from './services/vault/vault.service.mock';
import { createPlatformMock, createNavControllerMock } from '../../test/mocks';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: NavController, useFactory: createNavControllerMock },
        { provide: Platform, useFactory: createPlatformMock },
        { provide: VaultService, useFactory: createVaultServiceMock },
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});

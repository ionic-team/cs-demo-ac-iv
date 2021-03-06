import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { AuthenticationService, VaultService } from '@app/services';
import { createVaultServiceMock } from '@app/services/mocks';
import { Platform } from '@ionic/angular';
import { createPlatformMock, createRouterMock } from '@test/mocks';
import { Router } from '@angular/router';

describe('AuthenticationService', () => {
  let authentication: AuthenticationService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthenticationService,
        { provide: VaultService, useFactory: createVaultServiceMock },
        { provide: Platform, useFactory: createPlatformMock },
        { provide: Router, useFactory: createRouterMock },
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
  });

  beforeEach(inject(
    [AuthenticationService],
    (service: AuthenticationService) => {
      authentication = service;
    },
  ));

  it('injects', () => {
    expect(authentication).toBeTruthy();
  });

  // Due to the nature of this class, it is very hard to test in any non-fragile manner.
});

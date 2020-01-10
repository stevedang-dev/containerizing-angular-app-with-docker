import { TestBed } from '@angular/core/testing';

import { FormValidatorsService } from './form-validators.service';

describe('FormValidatorsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FormValidatorsService = TestBed.get(FormValidatorsService);
    expect(service).toBeTruthy();
  });
});

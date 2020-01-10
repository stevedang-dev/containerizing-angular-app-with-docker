import { TestBed } from '@angular/core/testing';

import { FormEditorService } from './form-editor.service';

describe('FormEditorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FormEditorService = TestBed.get(FormEditorService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import { Resumen } from './resumen.service';

describe('Resumen', () => {
  let service: Resumen;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Resumen);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

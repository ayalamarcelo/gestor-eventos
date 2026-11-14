import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PanelOrganizador } from './panel-organizador';

describe('PanelOrganizador', () => {
  let component: PanelOrganizador;
  let fixture: ComponentFixture<PanelOrganizador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelOrganizador],
    }).compileComponents();

    fixture = TestBed.createComponent(PanelOrganizador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

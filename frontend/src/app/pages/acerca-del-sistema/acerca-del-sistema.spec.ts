import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AcercaDelSistema } from './acerca-del-sistema';

describe('AcercaDelSistema', () => {
  let component: AcercaDelSistema;
  let fixture: ComponentFixture<AcercaDelSistema>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcercaDelSistema],
    }).compileComponents();

    fixture = TestBed.createComponent(AcercaDelSistema);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

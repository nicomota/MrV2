import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroContabilComponent } from './registro-contabil.component';

describe('RegistroContabilComponent', () => {
  let component: RegistroContabilComponent;
  let fixture: ComponentFixture<RegistroContabilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroContabilComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroContabilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

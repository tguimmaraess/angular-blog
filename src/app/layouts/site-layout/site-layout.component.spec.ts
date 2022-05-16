import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutWithoutMenuComponent } from './layout-without-menu.component';

describe('LayoutWithoutMenuComponent', () => {
  let component: LayoutWithoutMenuComponent;
  let fixture: ComponentFixture<LayoutWithoutMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LayoutWithoutMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutWithoutMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

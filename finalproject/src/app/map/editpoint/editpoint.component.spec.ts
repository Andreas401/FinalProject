import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditpointComponent } from './editpoint.component';

describe('EditpointComponent', () => {
  let component: EditpointComponent;
  let fixture: ComponentFixture<EditpointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditpointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditpointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

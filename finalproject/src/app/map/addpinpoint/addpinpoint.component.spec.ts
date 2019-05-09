import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddpinpointComponent } from './addpinpoint.component';

describe('AddpinpointComponent', () => {
  let component: AddpinpointComponent;
  let fixture: ComponentFixture<AddpinpointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddpinpointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddpinpointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

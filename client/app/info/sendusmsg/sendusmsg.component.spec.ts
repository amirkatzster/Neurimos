/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SendusmsgComponent } from './sendusmsg.component';

describe('SendusmsgComponent', () => {
  let component: SendusmsgComponent;
  let fixture: ComponentFixture<SendusmsgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendusmsgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendusmsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

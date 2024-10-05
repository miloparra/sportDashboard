import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunModalComponent } from './run-modal.component';

describe('RunModalComponent', () => {
  let component: RunModalComponent;
  let fixture: ComponentFixture<RunModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RunModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RunModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

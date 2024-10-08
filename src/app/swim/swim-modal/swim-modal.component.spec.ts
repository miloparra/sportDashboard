import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwimModalComponent } from './swim-modal.component';

describe('SwimModalComponent', () => {
  let component: SwimModalComponent;
  let fixture: ComponentFixture<SwimModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwimModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwimModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

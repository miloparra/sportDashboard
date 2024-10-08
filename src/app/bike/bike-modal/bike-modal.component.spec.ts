import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BikeModalComponent } from './bike-modal.component';

describe('BikeModalComponent', () => {
  let component: BikeModalComponent;
  let fixture: ComponentFixture<BikeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BikeModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BikeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

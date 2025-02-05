import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesDonutComponent } from './activities-donut.component';

describe('ActivitiesDonutComponent', () => {
  let component: ActivitiesDonutComponent;
  let fixture: ComponentFixture<ActivitiesDonutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivitiesDonutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivitiesDonutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

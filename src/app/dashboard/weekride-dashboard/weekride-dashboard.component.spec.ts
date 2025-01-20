import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekrideDashboardComponent } from './weekride-dashboard.component';

describe('WeekrideDashboardComponent', () => {
  let component: WeekrideDashboardComponent;
  let fixture: ComponentFixture<WeekrideDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeekrideDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeekrideDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

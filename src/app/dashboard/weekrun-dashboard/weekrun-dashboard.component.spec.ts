import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekrunDashboardComponent } from './weekrun-dashboard.component';

describe('WeekrunDashboardComponent', () => {
  let component: WeekrunDashboardComponent;
  let fixture: ComponentFixture<WeekrunDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeekrunDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeekrunDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

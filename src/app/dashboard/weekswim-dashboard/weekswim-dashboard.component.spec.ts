import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekswimDashboardComponent } from './weekswim-dashboard.component';

describe('WeekswimDashboardComponent', () => {
  let component: WeekswimDashboardComponent;
  let fixture: ComponentFixture<WeekswimDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeekswimDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeekswimDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

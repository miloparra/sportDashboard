import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditRideComponent } from './modal-edit-ride.component';

describe('ModalEditRideComponent', () => {
  let component: ModalEditRideComponent;
  let fixture: ComponentFixture<ModalEditRideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditRideComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditRideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolutionMapComponent } from './polution-map.component';

describe('PolutionMapComponent', () => {
  let component: PolutionMapComponent;
  let fixture: ComponentFixture<PolutionMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolutionMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolutionMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

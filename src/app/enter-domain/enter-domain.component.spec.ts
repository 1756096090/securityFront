import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterDomainComponent } from './enter-domain.component';

describe('EnterDomainComponent', () => {
  let component: EnterDomainComponent;
  let fixture: ComponentFixture<EnterDomainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnterDomainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnterDomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsScanComponent } from './assets-scan.component';

describe('AssetsScanComponent', () => {
  let component: AssetsScanComponent;
  let fixture: ComponentFixture<AssetsScanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetsScanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

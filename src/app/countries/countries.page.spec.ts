import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CountriesPage } from './countries.page';

describe('CountriesPage', () => {
  let component: CountriesPage;
  let fixture: ComponentFixture<CountriesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountriesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CountriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

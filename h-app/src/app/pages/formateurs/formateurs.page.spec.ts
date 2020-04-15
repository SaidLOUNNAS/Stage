import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IonicModule } from '@ionic/angular';

import { FormateursPage } from './formateurs.page';

describe('UsersPage', () => {
  let component: FormateursPage;
  let fixture: ComponentFixture<FormateursPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormateursPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(FormateursPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

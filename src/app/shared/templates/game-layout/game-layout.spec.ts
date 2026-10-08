import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameLayoutComponent } from './game-layout';
import { By } from '@angular/platform-browser';

describe('GameLayoutComponent', () => {
  let component: GameLayoutComponent;
  let fixture: ComponentFixture<GameLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameLayoutComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GameLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render header slot', () => {
    const header = fixture.debugElement.query(By.css('.game-layout__header'));
    expect(header).toBeTruthy();
  });

  it('should render main slot', () => {
    const main = fixture.debugElement.query(By.css('.game-layout__main'));
    expect(main).toBeTruthy();
  });

  it('should render footer slot', () => {
    const footer = fixture.debugElement.query(By.css('.game-layout__footer'));
    expect(footer).toBeTruthy();
  });
});
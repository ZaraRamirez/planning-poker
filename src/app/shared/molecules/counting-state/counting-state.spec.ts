import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CountingStateComponent } from './counting-state';
import { By } from '@angular/platform-browser';

describe('CountingStateComponent', () => {
  let component: CountingStateComponent;
  let fixture: ComponentFixture<CountingStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountingStateComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CountingStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the dots animation', () => {
    const dots = fixture.debugElement.query(By.css('.counting-state__dots'));
    expect(dots).toBeTruthy();
  });

  it('should render four dots', () => {
    const spans = fixture.debugElement.queryAll(By.css('.counting-state__dots span'));
    expect(spans.length).toBe(4);
  });

  it('should render "Contando votos" label', () => {
    const label = fixture.debugElement.query(By.css('.counting-state__label'));
    expect(label.nativeElement.textContent.trim()).toBe('Contando votos');
  });
});
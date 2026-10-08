import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RadioGroupComponent } from './radio-group';
import { By } from '@angular/platform-browser';
import { ComponentRef } from '@angular/core';

describe('RadioGroupComponent', () => {
  let component: RadioGroupComponent;
  let fixture: ComponentFixture<RadioGroupComponent>;
  let componentRef: ComponentRef<RadioGroupComponent>;

  const mockOptions = [
    { label: 'Jugador', value: 'player' },
    { label: 'Espectador', value: 'spectator' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioGroupComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RadioGroupComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('options', mockOptions);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all options', () => {
    const options = fixture.debugElement.queryAll(By.css('.radio-group__option'));
    expect(options.length).toBe(2);
  });

  it('should render correct labels', () => {
    const labels = fixture.debugElement.queryAll(By.css('.radio-group__label'));
    expect(labels[0].nativeElement.textContent).toBe('Jugador');
    expect(labels[1].nativeElement.textContent).toBe('Espectador');
  });

  it('should render label before radio circle', () => {
    const option = fixture.debugElement.query(By.css('.radio-group__option'));
    const children = option.nativeElement.children;
    expect(children[0].classList).toContain('radio-group__label');
    expect(children[2].classList).toContain('radio-group__custom');
  });

  it('should mark selected option as checked', () => {
    componentRef.setInput('selected', 'player');
    fixture.detectChanges();
    const inputs = fixture.debugElement.queryAll(By.css('.radio-group__input'));
    expect(inputs[0].nativeElement.checked).toBe(true);
    expect(inputs[1].nativeElement.checked).toBe(false);
  });

  it('should emit selectedChange when option is selected', () => {
    let emittedValue = '';
    component.selectedChange.subscribe((value: string) => emittedValue = value);
    const inputs = fixture.debugElement.queryAll(By.css('.radio-group__input'));
    inputs[1].nativeElement.dispatchEvent(new Event('change'));
    expect(emittedValue).toBe('spectator');
  });
});
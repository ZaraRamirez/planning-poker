import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputComponent } from './input';
import { By } from '@angular/platform-browser';
import { ComponentRef } from '@angular/core';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;
  let componentRef: ComponentRef<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render label when label input is provided', () => {
    componentRef.setInput('label', 'Nombra la partida');
    fixture.detectChanges();
    const label = fixture.debugElement.query(By.css('.input__label'));
    expect(label).toBeTruthy();
    expect(label.nativeElement.textContent).toBe('Nombra la partida');
  });

  it('should not render label when label input is empty', () => {
    const label = fixture.debugElement.query(By.css('.input__label'));
    expect(label).toBeNull();
  });

  it('should render placeholder', () => {
    componentRef.setInput('placeholder', 'Escribe aquí');
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('.input__field'));
    expect(input.nativeElement.placeholder).toBe('Escribe aquí');
  });

  it('should apply error class when hasError is true', () => {
    componentRef.setInput('hasError', true);
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('.input__field'));
    expect(input.nativeElement.classList).toContain('input__field--error');
  });

  it('should show error message when hasError and errorMessage are set', () => {
    componentRef.setInput('hasError', true);
    componentRef.setInput('errorMessage', 'Campo requerido');
    fixture.detectChanges();
    const error = fixture.debugElement.query(By.css('.input__error'));
    expect(error).toBeTruthy();
    expect(error.nativeElement.textContent).toBe('Campo requerido');
  });

  it('should not show error message when hasError is false', () => {
    componentRef.setInput('errorMessage', 'Campo requerido');
    fixture.detectChanges();
    const error = fixture.debugElement.query(By.css('.input__error'));
    expect(error).toBeNull();
  });

  it('should be disabled when disabled input is true', () => {
    componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('.input__field'));
    expect(input.nativeElement.disabled).toBe(true);
  });

  it('should emit valueChange when user types', () => {
    let emittedValue = '';
    component.valueChange.subscribe((value: string) => emittedValue = value);
    const input = fixture.debugElement.query(By.css('.input__field'));
    input.nativeElement.value = 'Sprint 32';
    input.nativeElement.dispatchEvent(new Event('input'));
    expect(emittedValue).toBe('Sprint 32');
  });

  it('should emit enterPressed when Enter key is pressed', () => {
    let emitted = false;
    component.enterPressed.subscribe(() => emitted = true);
    const input = fixture.debugElement.query(By.css('.input__field'));
    input.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(emitted).toBe(true);
  });
});
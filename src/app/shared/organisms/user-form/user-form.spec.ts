import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserFormComponent } from './user-form';
import { By } from '@angular/platform-browser';
import { ComponentRef } from '@angular/core';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let componentRef: ComponentRef<UserFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    componentRef.setInput('title', 'Tu nombre');
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('.user-form__title'));
    expect(title.nativeElement.textContent).toBe('Tu nombre');
  });

  it('should not show error before user interacts', () => {
    expect(component.errorMessage()).toBe('');
  });

  it('should show error when name is empty and form is touched', () => {
    component.onSubmit();
    fixture.detectChanges();
    expect(component.errorMessage()).toBe('El nombre es requerido');
  });

  it('should show error when name is less than 5 characters', () => {
    component.onNameChange('abc');
    component.onSubmit();
    expect(component.errorMessage()).toBe('El nombre debe tener mínimo 5 caracteres');
  });

  it('should show error when name has special characters', () => {
    component.onNameChange('Sprint_32');
    component.onSubmit();
    expect(component.errorMessage()).toBe('El nombre no puede tener caracteres especiales');
  });

  it('should show error when name contains only numbers', () => {
    component.onNameChange('12345');
    component.onSubmit();
    expect(component.errorMessage()).toBe('El nombre no puede contener solo números');
  });

  it('should show error when name has more than 3 numbers', () => {
    component.onNameChange('Sprint1234');
    component.onSubmit();
    expect(component.errorMessage()).toBe('El nombre puede tener máximo 3 números');
  });

  it('should show error when name is more than 20 characters', () => {
    component.onNameChange('EstoEsUnNombreMuyLargoSinNumeros');
    component.onSubmit();
    expect(component.errorMessage()).toBe('El nombre debe tener máximo 20 caracteres');
  });

  it('should default mode to player', () => {
    expect(component.mode()).toBe('player');
  });

  it('should change mode when radio is selected', () => {
    component.onModeChange('spectator');
    expect(component.mode()).toBe('spectator');
  });

  it('should emit userCreated with name and mode when valid', () => {
    let emitted: { name: string; mode: string } | null = null;
    component.userCreated.subscribe(value => emitted = value);
    component.onNameChange('Luisa');
    component.onSubmit();
    expect(emitted).toEqual({ name: 'Luisa', mode: 'player' });
  });

  it('should not emit userCreated when form is invalid', () => {
    let emitted = false;
    component.userCreated.subscribe(() => emitted = true);
    component.onNameChange('abc');
    component.onSubmit();
    expect(emitted).toBe(false);
  });
});
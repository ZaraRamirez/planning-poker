import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateGameFormComponent } from './create-game-form';
import { By } from '@angular/platform-browser';

describe('CreateGameFormComponent', () => {
  let component: CreateGameFormComponent;
  let fixture: ComponentFixture<CreateGameFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateGameFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateGameFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
    fixture.detectChanges();
    expect(component.errorMessage()).toBe('El nombre debe tener mínimo 5 caracteres');
  });

  it('should show error when name is more than 20 characters', () => {
    component.onNameChange('NombreMuyLargoSinNumeros');
    component.onSubmit();
    fixture.detectChanges();
    expect(component.errorMessage()).toBe('El nombre debe tener máximo 20 caracteres');
  });

  it('should show error when name has special characters', () => {
    component.onNameChange('Sprint_32');
    component.onSubmit();
    fixture.detectChanges();
    expect(component.errorMessage()).toBe('El nombre no puede tener caracteres especiales');
  });

  it('should show error when name contains only numbers', () => {
    component.onNameChange('12345');
    component.onSubmit();
    fixture.detectChanges();
    expect(component.errorMessage()).toBe('El nombre no puede contener solo números');
  });

  it('should show error when name has more than 3 numbers', () => {
    component.onNameChange('Sprint1234');
    component.onSubmit();
    fixture.detectChanges();
    expect(component.errorMessage()).toBe('El nombre puede tener máximo 3 números');
  });

  it('should be valid with a correct name', () => {
    component.onNameChange('Sprint 32');
    fixture.detectChanges();
    expect(component.isValid()).toBe(true);
  });

  it('should emit gameCreated with game name when form is valid', () => {
    let emittedName = '';
    component.gameCreated.subscribe((name: string) => emittedName = name);
    component.onNameChange('Sprint 32');
    component.onSubmit();
    expect(emittedName).toBe('Sprint 32');
  });

  it('should not emit gameCreated when form is invalid', () => {
    let emitted = false;
    component.gameCreated.subscribe(() => emitted = true);
    component.onNameChange('abc');
    component.onSubmit();
    expect(emitted).toBe(false);
  });
});
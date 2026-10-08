import { Component, input, output, computed, signal } from '@angular/core';
import { InputComponent } from '../../atoms/input/input';
import { ButtonComponent } from '../../atoms/button/button';
import { RadioGroupComponent } from '../../molecules/radio-group/radio-group';
import { PlayerMode } from '../../../core/models/game.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [InputComponent, ButtonComponent, RadioGroupComponent],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css'
})
export class UserFormComponent {
  readonly title = input<string>('Tu nombre');

  readonly userCreated = output<{ name: string; mode: PlayerMode }>();

  readonly name = signal('');
  readonly mode = signal<PlayerMode>('player');
  readonly touched = signal(false);

  readonly modeOptions = [
    { label: 'Jugador', value: 'player' },
    { label: 'Espectador', value: 'spectator' }
  ];

  readonly errorMessage = computed(() => {
    const name = this.name();
    if (!this.touched()) return '';
    if (!name) return 'El nombre es requerido';
    if (/[_,.*#/\-]/.test(name)) return 'El nombre no puede tener caracteres especiales';
    if (/^\d+$/.test(name)) return 'El nombre no puede contener solo números';
    if ((name.match(/\d/g) || []).length > 3) return 'El nombre puede tener máximo 3 números';
    if (name.length < 5) return 'El nombre debe tener mínimo 5 caracteres';
    if (name.length > 20) return 'El nombre debe tener máximo 20 caracteres';
    return '';
  });

  readonly isValid = computed(() => {
    const name = this.name();
    if (!name) return false;
    return !/[_,.*#/\-]/.test(name) &&
      !/^\d+$/.test(name) &&
      (name.match(/\d/g) || []).length <= 3 &&
      name.length >= 5 &&
      name.length <= 20;
  });

  onNameChange(value: string): void {
    this.name.set(value);
  }

  onModeChange(value: string): void {
    this.mode.set(value as PlayerMode);
  }

  onSubmit(): void {
    this.touched.set(true);
    if (this.isValid()) {
      this.userCreated.emit({ name: this.name(), mode: this.mode() });
    }
  }
}
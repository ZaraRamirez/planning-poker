import { Component, output, signal, computed } from '@angular/core';
import { InputComponent } from '../../atoms/input/input';
import { ButtonComponent } from '../../atoms/button/button';

@Component({
  selector: 'app-create-game-form',
  standalone: true,
  imports: [InputComponent, ButtonComponent],
  templateUrl: './create-game-form.html',
  styleUrl: './create-game-form.css'
})
export class CreateGameFormComponent {
  readonly gameCreated = output<string>();

  readonly gameName = signal('');
  readonly touched = signal(false);

  readonly errorMessage = computed(() => {
    const name = this.gameName();
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
    const name = this.gameName();
    if (!name) return false;
    return !/[_,.*#/\-]/.test(name) &&
      !/^\d+$/.test(name) &&
      (name.match(/\d/g) || []).length <= 3 &&
      name.length >= 5 &&
      name.length <= 20;
  });

  onNameChange(value: string): void {
    this.gameName.set(value);
  }

  onSubmit(): void {
    this.touched.set(true);
    if (this.isValid()) {
      this.gameCreated.emit(this.gameName());
    }
  }
}
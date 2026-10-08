import { Component, input, output, computed } from '@angular/core';

export type InputType = 'text' | 'password' | 'email';

@Component({
  selector: 'app-input',
  standalone: true,
  templateUrl: './input.html',
  styleUrl: './input.css'
})
export class InputComponent {
  readonly placeholder = input<string>('');
  readonly label = input<string>('');
  readonly type = input<InputType>('text');
  readonly value = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly hasError = input<boolean>(false);
  readonly errorMessage = input<string>('');

  readonly valueChange = output<string>();
  readonly enterPressed = output<void>();

  readonly inputClasses = computed(() => [
    'input__field',
    this.hasError() ? 'input__field--error' : '',
    this.disabled() ? 'input__field--disabled' : ''
  ].filter(Boolean).join(' '));

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.valueChange.emit(target.value);
  }

  onEnterPressed(): void {
    this.enterPressed.emit();
  }
}
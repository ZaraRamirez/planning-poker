import { Component, input, computed } from '@angular/core';

export type CardState = 'empty' | 'selected' | 'revealed';
export type CardVariant = 'pool' | 'table';

@Component({
  selector: 'app-card',
  standalone: true,
  templateUrl: './card.html',
  styleUrl: './card.css'
})
export class CardComponent {
  readonly state = input<CardState>('empty');
  readonly value = input<string | number>('');
  readonly isSelectable = input<boolean>(false);
  readonly isActive = input<boolean>(false);
  readonly variant = input<CardVariant>('pool');

  readonly classes = computed(() => [
    'card',
    `card--${this.state()}`,
    this.variant() === 'table' ? 'card--table' : '',
    this.isSelectable() ? 'card--selectable' : '',
    this.isActive() ? 'card--active' : ''
  ].filter(Boolean).join(' '));

  readonly showValue = computed(() => this.state() !== 'empty');
}
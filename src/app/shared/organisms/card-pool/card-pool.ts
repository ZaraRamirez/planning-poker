import { Component, input, output, computed } from '@angular/core';
import { CardComponent } from '../../atoms/card/card';
import { Card } from '../../../core/models/game.model';

@Component({
  selector: 'app-card-pool',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './card-pool.html',
  styleUrl: './card-pool.css'
})
export class CardPoolComponent {
  readonly cards = input.required<Card[]>();
  readonly isDisabled = input<boolean>(false);
  readonly selectedCardId = input<string | null>(null);
  
  readonly cardSelected = output<Card>();

  isCardSelected(cardId: string): boolean {
    return this.selectedCardId() === cardId;
  }

  onCardClick(card: Card): void {
    if (!this.isDisabled()) {
      this.cardSelected.emit(card);
    }
  }
}
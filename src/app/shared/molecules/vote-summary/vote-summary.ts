import { Component, input, computed } from '@angular/core';
import { CardComponent } from '../../atoms/card/card';
import { VoteGroup } from '../../../core/models/vote-summary.model';

@Component({
  selector: 'app-vote-summary',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './vote-summary.html',
  styleUrl: './vote-summary.css'
})
export class VoteSummaryComponent {
  readonly voteGroups = input<VoteGroup[]>([]);
  readonly average = input<number | null>(null);

  readonly formattedAverage = computed(() => {
    const avg = this.average();
    if (avg === null) return '—';
    return Number.isInteger(avg)
      ? avg.toString()
      : avg.toFixed(1).replace('.', ',');
  });

  readonly hasNumericVotes = computed(() => this.average() !== null);

  voteLabel(count: number): string {
    return count === 1 ? '1 Voto' : `${count} Votos`;
  }
}
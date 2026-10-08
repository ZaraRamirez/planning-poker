import { Component, input, output } from '@angular/core';
import { InviteLinkComponent } from '../../molecules/invite-link/invite-link';

@Component({
  selector: 'app-invite-modal',
  standalone: true,
  imports: [InviteLinkComponent],
  templateUrl: './invite-modal.html',
  styleUrl: './invite-modal.css'
})
export class InviteModalComponent {
  readonly link = input<string>('');
  readonly closeModal = output<void>();

  onOverlayClick(): void {
    this.closeModal.emit();
  }

  onClose(): void {
    this.closeModal.emit();
  }
}
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VotingTableComponent } from './voting-table';
import { By } from '@angular/platform-browser';
import { ComponentRef } from '@angular/core';
import { Player } from '../../../core/models/game.model';

describe('VotingTableComponent', () => {
  let component: VotingTableComponent;
  let fixture: ComponentFixture<VotingTableComponent>;
  let componentRef: ComponentRef<VotingTableComponent>;

  const mockPlayers: Player[] = [
    { id: 'p1', name: 'Luisa', role: 'admin', mode: 'player', selectedCard: null },
    { id: 'p2', name: 'Oscar', role: 'player', mode: 'player', selectedCard: null },
    { id: 'p3', name: 'Vale', role: 'player', mode: 'spectator', selectedCard: null },
  ];

  const mockCard = { id: '5', value: 5 };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VotingTableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(VotingTableComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all players', () => {
    componentRef.setInput('players', mockPlayers);
    fixture.detectChanges();
    const cards = fixture.debugElement.queryAll(By.css('app-player-card'));
    expect(cards.length).toBe(3);
  });

  it('should render empty state when no players', () => {
    const cards = fixture.debugElement.queryAll(By.css('app-player-card'));
    expect(cards.length).toBe(0);
  });

  it('should apply custom style with angle to each player container', () => {
    componentRef.setInput('players', mockPlayers);
    fixture.detectChanges();
    const playerDivs = fixture.debugElement.queryAll(By.css('.voting-table__player'));
    expect(playerDivs.length).toBe(3);
    playerDivs.forEach((div, idx) => {
      const style = div.nativeElement.style;
      const angle = component.getAngle(idx, mockPlayers.length);
      expect(style.getPropertyValue('--angle')).toBeTruthy();
      const angleValue = parseFloat(style.getPropertyValue('--angle'));
      expect(angleValue).toBeCloseTo(angle, 5);
    });
  });

  it('should render three table layers', () => {
    const outer = fixture.debugElement.query(By.css('.voting-table__outer'));
    const middle = fixture.debugElement.query(By.css('.voting-table__middle'));
    const inner = fixture.debugElement.query(By.css('.voting-table__inner'));
    expect(outer).toBeTruthy();
    expect(middle).toBeTruthy();
    expect(inner).toBeTruthy();
  });

  it('should calculate angle correctly for first player (bottom)', () => {
    const angle = component.getAngle(0, 4);
    expect(angle).toBeCloseTo(Math.PI / 2, 5);
  });

  it('should calculate angle for second player (next clockwise)', () => {
    const angle = component.getAngle(1, 4);
    expect(angle).toBeCloseTo(Math.PI, 5);
  });

  it('should return 0 angle when total is 0', () => {
    expect(component.getAngle(0, 0)).toBe(0);
  });

  describe('getCardState', () => {
    it('should return empty when player has no selected card', () => {
      const player: Player = { ...mockPlayers[0], selectedCard: null };
      componentRef.setInput('gameStatus', 'voting');
      expect(component.getCardState(player)).toBe('empty');
    });

    it('should return selected when player voted but game is still in voting phase', () => {
      const player: Player = { ...mockPlayers[0], selectedCard: mockCard };
      componentRef.setInput('gameStatus', 'voting');
      expect(component.getCardState(player)).toBe('selected');
    });

    it('should return revealed when player voted and game is in revealed phase', () => {
      const player: Player = { ...mockPlayers[0], selectedCard: mockCard };
      componentRef.setInput('gameStatus', 'revealed');
      expect(component.getCardState(player)).toBe('revealed');
    });

    it('should not reveal card value in template until game status is revealed', () => {
      const votedPlayers = mockPlayers.map(p => ({ ...p, selectedCard: mockCard }));
      componentRef.setInput('players', votedPlayers);
      componentRef.setInput('gameStatus', 'voting');
      fixture.detectChanges();

      const playerCards = fixture.debugElement.queryAll(By.css('app-player-card'));
      playerCards.forEach(card => {
        expect(card.componentInstance.cardState()).toBe('selected');
        expect(card.componentInstance.cardValue()).toBeNull();
      });
    });

    it('should reveal card values in template when game status is revealed', () => {
      const votedPlayers = mockPlayers.map(p => ({ ...p, selectedCard: mockCard }));
      componentRef.setInput('players', votedPlayers);
      componentRef.setInput('gameStatus', 'revealed');
      fixture.detectChanges();

      const playerCards = fixture.debugElement.queryAll(By.css('app-player-card'));
      playerCards.forEach(card => {
        expect(card.componentInstance.cardState()).toBe('revealed');
        expect(card.componentInstance.cardValue()).toEqual(mockCard);
      });
    });
  });
});
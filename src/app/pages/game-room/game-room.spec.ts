import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameRoomComponent } from './game-room';
import { GameStore } from '../../core/stores/game.store';
import { provideRouter } from '@angular/router';

describe('GameRoomComponent', () => {
  let component: GameRoomComponent;
  let fixture: ComponentFixture<GameRoomComponent>;
  let gameStore: GameStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameRoomComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(GameRoomComponent);
    component = fixture.componentInstance;
    gameStore = TestBed.inject(GameStore);
    gameStore.createGame('Test Game');
    fixture.detectChanges();
  });

  afterEach(() => {
    gameStore.clearCurrentPlayer();
    localStorage.removeItem('planning_poker_game');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show user form when no current player exists', () => {
    expect(component.showUserForm()).toBe(true);
    expect(component.currentPlayer()).toBeNull();
  });

  it('should not show user form after creating admin', () => {
    component.onUserCreated({ name: 'Luisa', mode: 'player' });
    fixture.detectChanges();

    expect(component.showUserForm()).toBe(false);
    expect(component.currentPlayer()?.name).toBe('Luisa');
  });

  it('should show card pool when current user is player and can vote', () => {
    component.onUserCreated({ name: 'Luisa', mode: 'player' });
    fixture.detectChanges();

    expect(component.showCardPool()).toBe(true);
    expect(component.currentUserCanVote()).toBe(true);
    expect(component.currentUserHasVoted()).toBe(false);
  });

  it('should not show card pool when current user is spectator', () => {
    component.onUserCreated({ name: 'Luisa', mode: 'spectator' });
    fixture.detectChanges();

    expect(component.showCardPool()).toBe(false);
    expect(component.currentUserCanVote()).toBe(false);
  });

  it('should keep card pool visible but disabled after user has voted', () => {
    component.onUserCreated({ name: 'Luisa', mode: 'player' });
    fixture.detectChanges();

    const mockCard = { id: '5', value: 5 };
    component.onCardSelected(mockCard);
    fixture.detectChanges();

    expect(component.currentUserHasVoted()).toBe(true);
    expect(component.showCardPool()).toBe(true);
    expect(component.currentUserCanVote()).toBe(false);
  });

  it('should update player vote when card is selected', () => {
    component.onUserCreated({ name: 'Luisa', mode: 'player' });
    fixture.detectChanges();

    const mockCard = { id: '5', value: 5 };
    component.onCardSelected(mockCard);
    fixture.detectChanges();

    expect(component.currentPlayer()?.selectedCard).toEqual(mockCard);
  });

  it('should not update vote if user cannot vote', () => {
    component.onUserCreated({ name: 'Luisa', mode: 'spectator' });
    fixture.detectChanges();

    const mockCard = { id: '5', value: 5 };
    component.onCardSelected(mockCard);
    fixture.detectChanges();

    expect(component.currentPlayer()?.selectedCard).toBeNull();
  });

  it('should toggle invite modal', () => {
    expect(component.showInviteModal()).toBe(false);

    component.onInviteClick();
    expect(component.showInviteModal()).toBe(true);

    component.onCloseInvite();
    expect(component.showInviteModal()).toBe(false);
  });
});
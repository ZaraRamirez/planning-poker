import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateGameComponent } from './create-game';
import { Router } from '@angular/router';
import { GameStore } from '../../core/stores/game.store';

describe('CreateGameComponent', () => {
  let component: CreateGameComponent;
  let fixture: ComponentFixture<CreateGameComponent>;
  let routerSpy: { navigate: ReturnType<typeof vi.fn> };
  let gameStoreSpy: {
    createGame: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    routerSpy = { navigate: vi.fn() };
    gameStoreSpy = {
      createGame: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [CreateGameComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: GameStore, useValue: gameStoreSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call gameStore.createGame with the game name', () => {
    component.onGameCreated('Sprint 32');
    expect(gameStoreSpy.createGame).toHaveBeenCalledWith('Sprint 32');
  });

  it('should navigate to /game after creating a game', () => {
    component.onGameCreated('Sprint 32');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/game']);
  });
});
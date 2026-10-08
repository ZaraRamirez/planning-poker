import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardPoolComponent } from './card-pool';
import { By } from '@angular/platform-browser';
import { ComponentRef } from '@angular/core';
import { Card } from '../../../core/models/game.model';

describe('CardPoolComponent', () => {
  let component: CardPoolComponent;
  let fixture: ComponentFixture<CardPoolComponent>;
  let componentRef: ComponentRef<CardPoolComponent>;

  const mockCards: Card[] = [
    { id: '1', value: 1 },
    { id: '2', value: 2 },
    { id: '3', value: 3 }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardPoolComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CardPoolComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('cards', mockCards);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all cards', () => {
    const cards = fixture.debugElement.queryAll(By.css('app-card'));
    expect(cards.length).toBe(3);
  });

  it('should render title', () => {
    const title = fixture.debugElement.query(By.css('.card-pool__title'));
    expect(title.nativeElement.textContent).toBe('Elige una carta 👇');
  });

  it('should show empty state message when no cards are provided', () => {
    componentRef.setInput('cards', []);
    fixture.detectChanges();
    const empty = fixture.debugElement.query(By.css('.card-pool__empty'));
    const title = fixture.debugElement.query(By.css('.card-pool__title'));
    expect(empty).toBeTruthy();
    expect(empty.nativeElement.textContent.trim()).toBe('No hay cartas registradas');
    expect(title).toBeNull();
  });

  it('should emit cardSelected when card is clicked and not disabled', () => {
    const emitSpy = vi.fn();
    component.cardSelected.subscribe(emitSpy);
    component.onCardClick(mockCards[0]);
    expect(emitSpy).toHaveBeenCalledWith(mockCards[0]);
  });

  it('should not emit when disabled', () => {
    componentRef.setInput('isDisabled', true);
    fixture.detectChanges();

    const emitSpy = vi.fn();
    component.cardSelected.subscribe(emitSpy);

    const firstCard = fixture.debugElement.query(By.css('.card-pool__item'));
    firstCard.triggerEventHandler('click', null);

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should mark card as selected when selectedCardId matches', () => {
    const selectedCardId = mockCards[2].id;
    componentRef.setInput('selectedCardId', selectedCardId);
    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.css('app-card'));
    const selectedCard = cards[2];
    expect(selectedCard.componentInstance.state()).toBe('selected');
    expect(selectedCard.componentInstance.isActive()).toBe(true);
  });

  it('should mark other cards as revealed', () => {
    const selectedCardId = mockCards[2].id;
    componentRef.setInput('selectedCardId', selectedCardId);
    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.css('app-card'));
    const unselectedCard = cards[0];
    expect(unselectedCard.componentInstance.state()).toBe('revealed');
    expect(unselectedCard.componentInstance.isActive()).toBe(false);
  });
});
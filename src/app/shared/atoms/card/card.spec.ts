import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardComponent } from './card';
import { By } from '@angular/platform-browser';
import { ComponentRef } from '@angular/core';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;
  let componentRef: ComponentRef<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render empty state by default', () => {
    const card = fixture.debugElement.query(By.css('.card'));
    expect(card.nativeElement.classList).toContain('card--empty');
  });

  it('should render selected state', () => {
    componentRef.setInput('state', 'selected');
    fixture.detectChanges();
    const card = fixture.debugElement.query(By.css('.card'));
    expect(card.nativeElement.classList).toContain('card--selected');
  });

  it('should render revealed state', () => {
    componentRef.setInput('state', 'revealed');
    fixture.detectChanges();
    const card = fixture.debugElement.query(By.css('.card'));
    expect(card.nativeElement.classList).toContain('card--revealed');
  });

  it('should show value when state is selected', () => {
    componentRef.setInput('state', 'selected');
    componentRef.setInput('value', 13);
    fixture.detectChanges();
    const value = fixture.debugElement.query(By.css('.card__value'));
    expect(value).toBeTruthy();
    expect(value.nativeElement.textContent).toBe('13');
  });

  it('should show value when state is revealed', () => {
    componentRef.setInput('state', 'revealed');
    componentRef.setInput('value', 5);
    fixture.detectChanges();
    const value = fixture.debugElement.query(By.css('.card__value'));
    expect(value).toBeTruthy();
    expect(value.nativeElement.textContent).toBe('5');
  });

  it('should not show value when state is empty', () => {
    const value = fixture.debugElement.query(By.css('.card__value'));
    expect(value).toBeNull();
  });

  it('should apply selectable class when isSelectable is true', () => {
    componentRef.setInput('isSelectable', true);
    fixture.detectChanges();
    const card = fixture.debugElement.query(By.css('.card'));
    expect(card.nativeElement.classList).toContain('card--selectable');
  });

  it('should apply active class when isActive is true', () => {
    componentRef.setInput('isActive', true);
    fixture.detectChanges();
    const card = fixture.debugElement.query(By.css('.card'));
    expect(card.nativeElement.classList).toContain('card--active');
  });
});
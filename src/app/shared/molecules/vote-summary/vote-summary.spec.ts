import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VoteSummaryComponent } from './vote-summary';
import { By } from '@angular/platform-browser';
import { ComponentRef } from '@angular/core';
import { VoteGroup } from '../../../core/models/vote-summary.model';

describe('VoteSummaryComponent', () => {
  let component: VoteSummaryComponent;
  let fixture: ComponentFixture<VoteSummaryComponent>;
  let componentRef: ComponentRef<VoteSummaryComponent>;

  const mockGroups: VoteGroup[] = [
    { cardId: '3',  value: 3,  count: 1 },
    { cardId: '5',  value: 5,  count: 1 },
    { cardId: '13', value: 13, count: 3 },
    { cardId: '21', value: 21, count: 2 },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoteSummaryComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(VoteSummaryComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render one group per vote value', () => {
    componentRef.setInput('voteGroups', mockGroups);
    fixture.detectChanges();
    const groups = fixture.debugElement.queryAll(By.css('.vote-summary__group'));
    expect(groups.length).toBe(4);
  });

  it('should render a card per group', () => {
    componentRef.setInput('voteGroups', mockGroups);
    fixture.detectChanges();
    const cards = fixture.debugElement.queryAll(By.css('app-card'));
    expect(cards.length).toBe(4);
  });

  it('should show "1 Voto" for count of 1', () => {
    expect(component.voteLabel(1)).toBe('1 Voto');
  });

  it('should show plural "N Votos" for count > 1', () => {
    expect(component.voteLabel(3)).toBe('3 Votos');
    expect(component.voteLabel(2)).toBe('2 Votos');
  });

  it('should show the average block when average is provided', () => {
    componentRef.setInput('average', 12.7);
    fixture.detectChanges();
    const avgBlock = fixture.debugElement.query(By.css('.vote-summary__average'));
    expect(avgBlock).toBeTruthy();
  });

  it('should not show the average block when average is null', () => {
    componentRef.setInput('average', null);
    fixture.detectChanges();
    const avgBlock = fixture.debugElement.query(By.css('.vote-summary__average'));
    expect(avgBlock).toBeNull();
  });

  it('should format decimal average with comma', () => {
    componentRef.setInput('average', 12.7);
    fixture.detectChanges();
    expect(component.formattedAverage()).toBe('12,7');
  });

  it('should format integer average without decimals', () => {
    componentRef.setInput('average', 8);
    fixture.detectChanges();
    expect(component.formattedAverage()).toBe('8');
  });

  it('should show — when average is null', () => {
    componentRef.setInput('average', null);
    fixture.detectChanges();
    expect(component.formattedAverage()).toBe('—');
  });

  it('should render vote count labels correctly', () => {
    componentRef.setInput('voteGroups', mockGroups);
    fixture.detectChanges();
    const counts = fixture.debugElement.queryAll(By.css('.vote-summary__count'));
    expect(counts[0].nativeElement.textContent.trim()).toBe('1 Voto');
    expect(counts[2].nativeElement.textContent.trim()).toBe('3 Votos');
    expect(counts[3].nativeElement.textContent.trim()).toBe('2 Votos');
  });
});
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserMenuComponent } from './user-menu';
import { By } from '@angular/platform-browser';
import { ComponentRef } from '@angular/core';
import { CARD_MODES } from '../../../core/models/card-mode.model';

describe('UserMenuComponent', () => {
  let component: UserMenuComponent;
  let fixture: ComponentFixture<UserMenuComponent>;
  let componentRef: ComponentRef<UserMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMenuComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UserMenuComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('userName', 'Luisa');
    componentRef.setInput('currentMode', 'player');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show popover by default', () => {
    const popover = fixture.debugElement.query(By.css('.user-menu__popover'));
    expect(popover).toBeNull();
  });

  it('should show popover when avatar is clicked', () => {
    const trigger = fixture.debugElement.query(By.css('.user-menu__trigger'));
    trigger.triggerEventHandler('click', null);
    fixture.detectChanges();
    const popover = fixture.debugElement.query(By.css('.user-menu__popover'));
    expect(popover).toBeTruthy();
  });

  it('should toggle popover on consecutive clicks', () => {
    const trigger = fixture.debugElement.query(By.css('.user-menu__trigger'));
    trigger.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.showMenu()).toBe(true);
    trigger.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.showMenu()).toBe(false);
  });

  it('should close popover when backdrop is clicked', () => {
    component.showMenu.set(true);
    fixture.detectChanges();
    const backdrop = fixture.debugElement.query(By.css('.user-menu__backdrop'));
    backdrop.triggerEventHandler('click', null);
    expect(component.showMenu()).toBe(false);
  });

  it('should show user name in popover', () => {
    component.showMenu.set(true);
    fixture.detectChanges();
    const name = fixture.debugElement.query(By.css('.user-menu__name'));
    expect(name.nativeElement.textContent.trim()).toBe('Luisa');
  });

  it('should emit modeChange and close menu when option selected', () => {
    component.showMenu.set(true);
    fixture.detectChanges();
    let emitted: string | null = null;
    component.modeChange.subscribe(v => emitted = v);
    component.onModeSelect('spectator');
    expect(emitted).toBe('spectator');
    expect(component.showMenu()).toBe(false);
  });

  it('should mark active mode option', () => {
    component.showMenu.set(true);
    fixture.detectChanges();
    const activeOptions = fixture.debugElement.queryAll(By.css('.user-menu__option--active'));
    expect(activeOptions.length).toBe(1);
  });

  function openAdminMenu() {
    componentRef.setInput('isAdmin', true);
    componentRef.setInput('cardModes', [...CARD_MODES]);
    componentRef.setInput('currentCardModeId', CARD_MODES[0].id);
    componentRef.setInput('gameStatus', 'voting');
    fixture.detectChanges();
    component.showMenu.set(true);
    fixture.detectChanges();
  }

  describe('card mode section', () => {

    it('should show card mode section for admin', () => {
      openAdminMenu();
      const allOptions = fixture.debugElement.queryAll(By.css('.user-menu__option'));
      expect(allOptions.length).toBeGreaterThan(2);
    });

    it('should not show card mode section for non-admin', () => {
      openAdminMenu();
      componentRef.setInput('isAdmin', false);
      fixture.detectChanges();
      const allOptions = fixture.debugElement.queryAll(By.css('.user-menu__option'));
      expect(allOptions.length).toBe(2);
    });

    it('should render all card mode options', () => {
      openAdminMenu();
      const allOptions = fixture.debugElement.queryAll(By.css('.user-menu__option'));
      expect(allOptions.length).toBe(2 + CARD_MODES.length);
    });

    it('should mark active card mode', () => {
      openAdminMenu();
      const activeOptions = fixture.debugElement.queryAll(By.css('.user-menu__option--active'));
      expect(activeOptions.length).toBeGreaterThanOrEqual(1);
    });

    it('should emit cardModeChange when option selected', () => {
      openAdminMenu();
      let emitted: string | null = null;
      component.cardModeChange.subscribe(v => emitted = v);
      component.onCardModeSelect(CARD_MODES[1].id);
      expect(emitted).toBe(CARD_MODES[1].id);
    });

    it('should disable card mode options when status is revealed', () => {
      openAdminMenu();
      componentRef.setInput('gameStatus', 'revealed');
      fixture.detectChanges();
      expect(component.isCardModeDisabled()).toBe(true);
    });

    it('should not emit cardModeChange when disabled', () => {
      openAdminMenu();
      componentRef.setInput('gameStatus', 'revealed');
      fixture.detectChanges();
      let emitted = false;
      component.cardModeChange.subscribe(() => emitted = true);
      component.onCardModeSelect(CARD_MODES[1].id);
      expect(emitted).toBe(false);
    });

    it('should show hint when card mode is disabled', () => {
      openAdminMenu();
      componentRef.setInput('gameStatus', 'revealed');
      fixture.detectChanges();
      component.showMenu.set(true);
      fixture.detectChanges();
      const hint = fixture.debugElement.query(By.css('.user-menu__hint'));
      expect(hint).toBeTruthy();
    });
  });
});
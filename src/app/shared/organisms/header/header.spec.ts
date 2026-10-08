import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header';
import { By } from '@angular/platform-browser';
import { ComponentRef } from '@angular/core';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let componentRef: ComponentRef<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render game name centered when inline is false', () => {
    componentRef.setInput('gameName', 'Sprint 32');
    componentRef.setInput('inline', false);
    fixture.detectChanges();
    const title = fixture.debugElement.query(
      By.css('.header__game-name:not(.header__game-name--inline)')
    );
    expect(title).toBeTruthy();
    expect(title.nativeElement.textContent.trim()).toBe('Sprint 32');
  });

  it('should not render centered title when gameName is empty', () => {
    componentRef.setInput('inline', false);
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('.header__game-name'));
    expect(title).toBeNull();
  });

  it('should render game name inline when inline is true', () => {
    componentRef.setInput('gameName', 'Crear partida');
    componentRef.setInput('inline', true);
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('.header__game-name--inline'));
    expect(title).toBeTruthy();
    expect(title.nativeElement.textContent.trim()).toBe('Crear partida');
  });

  it('should not render inline title when gameName is empty', () => {
    componentRef.setInput('inline', true);
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('.header__game-name--inline'));
    expect(title).toBeNull();
  });

  it('should render user-menu when userName is provided', () => {
    componentRef.setInput('userName', 'Luisa');
    fixture.detectChanges();
    const userMenu = fixture.debugElement.query(By.css('app-user-menu'));
    expect(userMenu).toBeTruthy();
  });

  it('should not render actions when userName is empty', () => {
    const actions = fixture.debugElement.query(By.css('.header__actions'));
    expect(actions).toBeNull();
  });

  it('should render invite button when user is logged in', () => {
    componentRef.setInput('userName', 'Luisa');
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('app-button'));
    expect(button).toBeTruthy();
  });

  it('should emit inviteClick when invite button is clicked', () => {
    componentRef.setInput('userName', 'Luisa');
    fixture.detectChanges();
    let emitted = false;
    component.inviteClick.subscribe(() => emitted = true);
    const button = fixture.debugElement.query(By.css('app-button'));
    button.triggerEventHandler('click', null);
    expect(emitted).toBe(true);
  });
});
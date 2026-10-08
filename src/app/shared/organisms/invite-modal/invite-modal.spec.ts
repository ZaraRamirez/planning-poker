import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InviteModalComponent } from './invite-modal';
import { By } from '@angular/platform-browser';
import { ComponentRef } from '@angular/core';

describe('InviteModalComponent', () => {
  let component: InviteModalComponent;
  let fixture: ComponentFixture<InviteModalComponent>;
  let componentRef: ComponentRef<InviteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InviteModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(InviteModalComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the modal title', () => {
    const title = fixture.debugElement.query(By.css('.invite-modal__title'));
    expect(title.nativeElement.textContent.trim()).toBe('Invitar jugadores');
  });

  it('should render the invite link component', () => {
    const inviteLink = fixture.debugElement.query(By.css('app-invite-link'));
    expect(inviteLink).toBeTruthy();
  });

  it('should pass the link to app-invite-link', () => {
    componentRef.setInput('link', 'https://planning-poker.com/game/abc123');
    fixture.detectChanges();
    const inviteLink = fixture.debugElement.query(By.css('app-invite-link'));
    expect(inviteLink.componentInstance.link()).toBe('https://planning-poker.com/game/abc123');
  });

  it('should emit closeModal when close button is clicked', () => {
    let emitted = false;
    component.closeModal.subscribe(() => emitted = true);
    const closeBtn = fixture.debugElement.query(By.css('.invite-modal__close'));
    closeBtn.triggerEventHandler('click', null);
    expect(emitted).toBe(true);
  });

  it('should emit closeModal when overlay is clicked', () => {
    let emitted = false;
    component.closeModal.subscribe(() => emitted = true);
    const overlay = fixture.debugElement.query(By.css('.invite-modal__overlay'));
    overlay.triggerEventHandler('click', null);
    expect(emitted).toBe(true);
  });

  it('should NOT emit closeModal when modal content is clicked', () => {
    let emitted = false;
    component.closeModal.subscribe(() => emitted = true);
    const modal = fixture.debugElement.query(By.css('.invite-modal'));
    modal.triggerEventHandler('click', new MouseEvent('click'));
    expect(emitted).toBe(false);
  });

  it('should render the close button', () => {
    const closeBtn = fixture.debugElement.query(By.css('.invite-modal__close'));
    expect(closeBtn).toBeTruthy();
  });
});
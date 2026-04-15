import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overlay" [class.visible]="visible" (click)="onCancel()">
      <div class="dialog" [class.visible]="visible" (click)="$event.stopPropagation()">

        <div class="icon-wrap">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </div>

        <h2 class="title">{{ title }}</h2>
        <p class="message">{{ message }}</p>

        <div class="actions">
          <button class="btn btn-cancel" (click)="onCancel()">Cancelar</button>
          <button class="btn btn-confirm" (click)="onConfirm()" [disabled]="loading">
            <span *ngIf="loading" class="spinner"></span>
            <span>{{ loading ? 'Eliminando…' : confirmLabel }}</span>
          </button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(10, 12, 18, 0.55);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      opacity: 0;
      pointer-events: none;
      transition: opacity 220ms ease;
    }
    .overlay.visible {
      opacity: 1;
      pointer-events: all;
    }
    .dialog {
      background: #fff;
      border-radius: 16px;
      padding: 2rem 2rem 1.6rem;
      width: 100%;
      max-width: 380px;
      box-shadow: 0 0 0 1px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.12);
      text-align: center;
      transform: translateY(12px) scale(0.97);
      opacity: 0;
      transition: transform 260ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 220ms ease;
    }
    .dialog.visible {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
    .icon-wrap {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: #fff1f1;
      color: #e03131;
      margin-bottom: 1.1rem;
    }
    .title {
      font-size: 1.1rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.4rem;
    }
    .message {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0 0 1.5rem;
      line-height: 1.55;
    }
    .actions {
      display: flex;
      gap: 0.65rem;
    }
    .btn {
      flex: 1;
      padding: 0.65rem 1rem;
      border-radius: 9px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      transition: background 160ms ease, transform 120ms ease;
    }
    .btn:active { transform: scale(0.97); }
    .btn-cancel { background: #f3f4f6; color: #374151; }
    .btn-cancel:hover { background: #e5e7eb; }
    .btn-confirm { background: #e03131; color: #fff; }
    .btn-confirm:hover:not(:disabled) { background: #c92a2a; }
    .btn-confirm:disabled { opacity: 0.65; cursor: not-allowed; }
    .spinner {
      width: 13px;
      height: 13px;
      border: 2px solid rgba(255,255,255,0.35);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class ConfirmDialogComponent {
  @Input() visible = false;
  @Input() title = '¿Eliminar elemento?';
  @Input() message = 'Esta acción no se puede deshacer.';
  @Input() confirmLabel = 'Eliminar';
  @Input() loading = false;

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm() {
    this.confirmed.emit();
  }

  onCancel() {
    if (this.loading) return;
    this.cancelled.emit();
  }
}
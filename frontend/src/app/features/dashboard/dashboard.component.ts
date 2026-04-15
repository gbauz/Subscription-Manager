import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriptionService } from '../../core/services/subscription.service';
import { Subscription, SubscriptionStats } from '../../core/models/subscription.model';
import { MonthlySummaryComponent } from './components/monthly-summary/monthly-summary.component';
import { UpcomingRenewalsComponent } from './components/upcoming-renewals/upcoming-renewals.component';
import { SubscriptionCardComponent } from './components/subscription-card/subscription-card.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MonthlySummaryComponent,
    UpcomingRenewalsComponent,
    SubscriptionCardComponent,
    ConfirmDialogComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private subscriptionService = inject(SubscriptionService);
  private router = inject(Router);

  subscriptions = signal<Subscription[]>([]);
  stats = signal<SubscriptionStats>({ totalMonthly: 0, count: 0, annualProjection: 0 });
  isLoading = signal(true);

  // Estado del diálogo
  showConfirm = false;
  deleting = false;
  pendingDelete: Subscription | null = null;

  activeSubscriptions = computed(() =>
    this.subscriptions().filter(s => s.status === 'active')
  );

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    this.subscriptionService.getAll().subscribe({
      next: (data) => this.subscriptions.set(data),
      error: (err) => console.error('Error cargando suscripciones:', err),
    });
    this.subscriptionService.getStats().subscribe({
      next: (data) => this.stats.set(data),
      error: (err) => console.error('Error cargando estadisticas:', err),
      complete: () => this.isLoading.set(false),
    });
  }

  handleEdit(subscription: Subscription): void {
    this.router.navigate(['/subscriptions', subscription.id, 'edit']);
  }

  handleDelete(subscription: Subscription): void {
    this.pendingDelete = subscription;
    this.showConfirm = true;
  }

  onDeleteConfirmed(): void {
    if (!this.pendingDelete) return;
    this.deleting = true;
    this.subscriptionService.delete(this.pendingDelete.id).subscribe({
      next: () => {
        this.loadData();
        this.closeDialog();
      },
      error: (err) => {
        console.error('Error eliminando suscripción:', err);
        this.deleting = false;
      },
    });
  }

  onDeleteCancelled(): void {
    this.closeDialog();
  }

  private closeDialog(): void {
    this.showConfirm = false;
    this.deleting = false;
    this.pendingDelete = null;
  }
}
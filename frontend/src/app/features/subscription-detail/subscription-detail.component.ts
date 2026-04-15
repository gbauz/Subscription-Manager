import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriptionService } from '../../core/services/subscription.service';
import { Subscription } from '../../core/models/subscription.model';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-subscription-detail',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, TitleCasePipe, EmptyStateComponent],
  templateUrl: './subscription-detail.component.html',
  styleUrl: './subscription-detail.component.scss'
})
export class SubscriptionDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private subscriptionService = inject(SubscriptionService);

  subscription = signal<Subscription | null>(null);
  isLoading = signal(true);
  notFound = signal(false);
  isUpdatingStatus = signal(false);

  monthlyEquivalent = computed(() => {
    const sub = this.subscription();
    if (!sub) return 0;
    return sub.billingCycle === 'annual' ? sub.price / 12 : sub.price;
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.isLoading.set(false);
      this.notFound.set(true);
      return;
    }

    this.subscriptionService.getById(id).subscribe({
      next: (sub) => {
        this.subscription.set(sub);
        this.notFound.set(false);
      },
      error: () => this.notFound.set(true),
      complete: () => this.isLoading.set(false)
    });
  }

  goBack(): void {
    this.router.navigate(['/subscriptions']);
  }

  editSubscription(): void {
    const sub = this.subscription();
    if (!sub) return;
    this.router.navigate(['/subscriptions', sub.id, 'edit']);
  }

  toggleStatus(): void {
    const sub = this.subscription();
    if (!sub || this.isUpdatingStatus()) return;

    const nextStatus: Subscription['status'] = sub.status === 'active' ? 'paused' : 'active';
    this.isUpdatingStatus.set(true);

    this.subscriptionService.update(sub.id, { status: nextStatus }).subscribe({
      next: (updated) => this.subscription.set(updated),
      error: (err) => console.error('Error actualizando estado:', err),
      complete: () => this.isUpdatingStatus.set(false)
    });
  }
}

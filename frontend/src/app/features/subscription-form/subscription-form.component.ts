import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SubscriptionService } from '../../core/services/subscription.service';
import { CATEGORIES } from '../../core/models/subscription.model';

@Component({
  selector: 'app-subscription-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './subscription-form.component.html',
  styleUrls: ['./subscription-form.component.scss']
})
export class SubscriptionFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private svc = inject(SubscriptionService);

  categories = CATEGORIES;
  isEditMode = false;
  editId: number | null = null;
  isSubmitting = false;
  submitError = '';

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    price: [null, [Validators.required, Validators.min(0.01)]],
    billingCycle: ['monthly'],
    category: ['', Validators.required],
    nextPaymentDate: ['', Validators.required],
    color: ['#0056D2'],
    icon: ['star'],
    status: ['active']
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;
      this.editId = Number(id);

      this.svc.getById(this.editId).subscribe({
        next: (sub) => {
          this.form.patchValue({
            ...sub,
            nextPaymentDate: sub.nextPaymentDate?.substring(0, 10) ?? ''
          });
        },
        error: () => {
          this.submitError = 'Could not load subscription data.';
        }
      });
    }
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }

  setBillingCycle(cycle: 'monthly' | 'annual'): void {
    this.form.patchValue({ billingCycle: cycle });
  }

  getCategoryIcon(): string {
    const selectedCategory = this.form.get('category')?.value;
    return CATEGORIES.find(category => category.value === selectedCategory)?.icon ?? 'subscriptions';
  }

  getDaysUntil(): string {
    const rawDate = this.form.get('nextPaymentDate')?.value;

    if (!rawDate) {
      return '';
    }

    const diff = Math.ceil(
      (new Date(rawDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    if (diff < 0) {
      return 'Overdue';
    }

    if (diff === 0) {
      return 'Today';
    }

    return `In ${diff}d`;
  }

  goBack(): void {
    this.router.navigate([this.isEditMode ? '/subscriptions' : '/dashboard']);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';

    const payload = this.form.getRawValue();

    const action$ =
      this.isEditMode && this.editId !== null
        ? this.svc.update(this.editId, payload)
        : this.svc.create(payload);

    action$.subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.isSubmitting = false;
        this.submitError = 'Something went wrong. Please try again.';
      }
    });
  }
}
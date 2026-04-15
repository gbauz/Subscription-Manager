import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { SubscriptionService } from '../../core/services/subscription.service';
import { Subscription, SubscriptionStats, CATEGORIES } from '../../core/models/subscription.model';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, DatePipe, EmptyStateComponent],
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.scss'
})
export class SubscriptionsComponent implements OnInit {

  // Inyectamos el servicio para consumir la API de suscripciones.
  // Desde aquí podremos obtener la lista, estadísticas y eliminar registros.
  private subscriptionService = inject(SubscriptionService);

  // Inyectamos el router para navegar entre pantallas.
  // Lo vamos a usar para ir a crear, editar o ver detalle.
  private router = inject(Router);

  // Aquí guardamos la lista completa de suscripciones.
  // Al inicio está vacía porque todavía no hemos cargado la data.
  subscriptions = signal<Subscription[]>([]);

  // Aquí guardamos las estadísticas del resumen.
  // Se inicializa con valores en 0 para evitar errores mientras carga.
  stats = signal<SubscriptionStats>({
    totalMonthly: 0,
    count: 0,
    annualProjection: 0
  });

  // Signal que controla el estado de carga.
  // Empieza en true porque al abrir la pantalla todavía estamos cargando.
  isLoading = signal(true);

  // Aquí guardamos el texto que escribe el usuario en el input de búsqueda.
  searchQuery = signal('');

  // Aquí guardamos el filtro de categoría activo.
  // Empieza en 'all' para mostrar todas las suscripciones.
  activeFilter = signal<string>('all');

  // Lista de categorías que viene desde el modelo.
  // Normalmente tiene label, value e icon.
  categories = CATEGORIES;

  // Computed que calcula cuál es la próxima suscripción en renovarse.
  //
  // Paso a paso:
  // 1. Copiamos la lista con [...this.subscriptions()] para no modificar la original
  // 2. Filtramos solo las activas
  // 3. Ordenamos por fecha de pago, de la más cercana a la más lejana
  // 4. Si hay elementos, devolvemos el primero
  // 5. Si no hay elementos, devolvemos null
  nextRenewal = computed(() => {
    const sorted = [...this.subscriptions()]
      .filter(s => s.status === 'active')
      .sort((a, b) => new Date(a.nextPaymentDate).getTime() - new Date(b.nextPaymentDate).getTime());

    return sorted.length > 0 ? sorted[0] : null;
  });

  // Computed que devuelve la lista filtrada.
  //
  // Aquí combinamos dos filtros:
  // 1. Búsqueda por nombre
  // 2. Filtro por categoría
  //
  // Esto era una de las partes que te pedían implementar.
  filteredSubscriptions = computed(() => {

    // Obtenemos la lista original
    const currentSubscriptions = this.subscriptions();

    // Obtenemos el texto de búsqueda y lo convertimos a minúscula
    // además usamos trim() para quitar espacios al inicio o final
    const query = this.searchQuery().trim().toLowerCase();

    // Obtenemos la categoría seleccionada
    const category = this.activeFilter();

    // Recorremos la lista y decidimos qué elementos sí pasan el filtro
    return currentSubscriptions.filter(subscription => {

      // Validación del filtro de búsqueda:
      // Si el usuario no escribió nada, se considera válido.
      // Si escribió algo, buscamos si el nombre contiene ese texto.
      const matchesSearch =
        query === '' ||
        subscription.name.toLowerCase().includes(query);

      // Validación del filtro de categoría:
      // Si está en 'all', todo pasa.
      // Si no, solo pasan las suscripciones cuya categoría coincida.
      const matchesCategory =
        category === 'all' ||
        subscription.category === category;

      // Solo se mostrará la suscripción si cumple ambas condiciones.
      return matchesSearch && matchesCategory;
    });
  });

  // Hook del ciclo de vida.
  // Angular ejecuta este método cuando el componente se inicializa.
  ngOnInit(): void {
    this.loadData();
  }

  // Método para cargar datos de la pantalla.
  //
  // Aquí hacemos dos llamadas:
  // 1. Obtener la lista de suscripciones
  // 2. Obtener las estadísticas
  loadData(): void {
    this.isLoading.set(true);

    // Cargamos la lista principal
    this.subscriptionService.getAll().subscribe({
      next: (data) => this.subscriptions.set(data),
      error: (err) => console.error('Error cargando suscripciones:', err),
    });

    // Cargamos el resumen / estadísticas
    this.subscriptionService.getStats().subscribe({
      next: (data) => this.stats.set(data),

      // Cuando esta llamada termina, apagamos el loading
      // En este ejemplo se está usando complete.
      complete: () => this.isLoading.set(false),

      error: (err) => {
        console.error('Error cargando estadísticas:', err);
        this.isLoading.set(false);
      }
    });
  }

  // Cambia la categoría activa cuando el usuario hace clic en un chip.
  setFilter(category: string): void {
    this.activeFilter.set(category);
  }

  // Actualiza el texto de búsqueda cada vez que el usuario escribe.
  onSearch(query: string): void {
    this.searchQuery.set(query);
  }

  // Navega a la pantalla de crear nueva suscripción.
  navigateToAdd(): void {
    this.router.navigate(['/subscriptions/new']);
  }

  // Navega a la pantalla de editar una suscripción.
  //
  // Ejemplo de ruta:
  // /subscriptions/5/edit
  navigateToEdit(id: number): void {
    this.router.navigate(['/subscriptions', id, 'edit']);
  }

  // Navega a la pantalla de detalle de una suscripción.
  //
  // Ejemplo de ruta:
  // /subscriptions/5
  navigateToDetail(id: number): void {
    this.router.navigate(['/subscriptions', id]);
  }

  // Elimina una suscripción.
  //
  // Paso a paso:
  // 1. Pedimos confirmación al usuario
  // 2. Si cancela, no hacemos nada
  // 3. Si acepta, llamamos al servicio delete()
  // 4. Cuando se elimina correctamente, recargamos la data
  toggleStatus(sub: Subscription): void {
    const nextStatus: Subscription['status'] = sub.status === 'active' ? 'paused' : 'active';

    this.subscriptionService.update(sub.id, { status: nextStatus }).subscribe({
      next: () => this.loadData(),
      error: (err) => {
        console.error('Error actualizando suscripción:', err);
      }
    });
  }

  handleDelete(id: number): void {
    const confirmed = window.confirm('¿Seguro que deseas eliminar esta suscripción?');

    if (!confirmed) {
      return;
    }

    this.subscriptionService.delete(id).subscribe({
      next: () => {
        this.loadData();
      },
      error: (err) => {
        console.error('Error eliminando suscripción:', err);
      }
    });
  }
}
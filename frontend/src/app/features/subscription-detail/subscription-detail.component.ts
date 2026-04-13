import { Component } from '@angular/core';

/**
 * BONUS: Componente de detalle de suscripcion
 *
 * ============================================================
 * INSTRUCCIONES (Tarea Bonus)
 * ============================================================
 *
 * 1. Carga la suscripcion usando ActivatedRoute.params y getById()
 * 2. Muestra todos los campos en una vista de detalle
 * 3. Agrega botones de accion: Editar (navega a /subscriptions/:id/edit)
 *    y Eliminar (con dialogo de confirmacion)
 * 4. Sigue el estilo de card del dashboard
 *
 * REFERENCIA: dashboard.component.ts para patrones de carga de datos
 * ============================================================
 */
@Component({
  selector: 'app-subscription-detail',
  standalone: true,
  imports: [],
  template: `
    <div style="padding: 2rem; text-align: center;">
      <h1 style="font-family: Manrope, sans-serif; margin-bottom: 1rem;">
        Detalle de Suscripcion
      </h1>
      <p style="color: #737785;">
        Componente bonus. Consulta INSTRUCTIONS.md
      </p>
    </div>
  `,
  styles: ``
})
export class SubscriptionDetailComponent {
  // TODO: Implementar (bonus)
}

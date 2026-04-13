import { Component } from '@angular/core';

/**
 * TODO: Componente de formulario para crear y editar suscripciones
 *
 * ============================================================
 * INSTRUCCIONES
 * ============================================================
 *
 * 1. IMPORTS necesarios:
 *    - ReactiveFormsModule (para FormGroup, FormControl, Validators)
 *    - Router y ActivatedRoute (para navegacion y parametros de ruta)
 *    - SubscriptionService (para create/update)
 *    - CATEGORIES desde subscription.model.ts (para el selector de categoria)
 *
 * 2. FORMULARIO REACTIVO:
 *    Crea un FormGroup con estos campos y validaciones:
 *    - name: required, minLength(2)
 *    - price: required, min(0.01)
 *    - billingCycle: required (valor por defecto: 'monthly')
 *    - category: required (valor por defecto: 'entertainment')
 *    - nextPaymentDate: required
 *    - color: opcional (valor por defecto: '#0056D2')
 *
 * 3. MODO CREAR vs EDITAR:
 *    - Inyecta ActivatedRoute y lee el parametro :id
 *    - Si hay :id -> modo edicion: carga los datos con getById() y usa patchValue()
 *    - Si no hay :id -> modo creacion
 *    - Usa un signal para saber en que modo estas: isEditMode = signal(false)
 *
 * 4. AL ENVIAR (onSubmit):
 *    - Verifica que el formulario es valido
 *    - Llama a create() o update() segun el modo
 *    - Navega al dashboard con Router.navigate(['/dashboard'])
 *
 * 5. ESTILOS:
 *    - Usa las variables de _variables.scss (colores, spacing, radii)
 *    - Usa los mixins de _mixins.scss (@include btn-primary, @include input-field)
 *    - Consulta los screenshots en /screenshots/ para referencia visual
 *    - Debe ser responsive (centrado en desktop, fullscreen en mobile)
 *
 * REFERENCIA: Revisa dashboard.component.ts para ver como:
 *   - Inyectar servicios con inject()
 *   - Usar signals (signal(), computed())
 *   - Navegar con Router
 * ============================================================
 */
@Component({
  selector: 'app-subscription-form',
  standalone: true,
  imports: [],
  template: `
    <div style="padding: 2rem; text-align: center;">
      <h1 style="font-family: Manrope, sans-serif; margin-bottom: 1rem;">
        Formulario de Suscripcion
      </h1>
      <p style="color: #737785;">
        Este componente esta pendiente de implementacion.
        Consulta las instrucciones en INSTRUCTIONS.md
      </p>
    </div>
  `,
  styles: ``
})
export class SubscriptionFormComponent {
  // TODO: Implementar
}

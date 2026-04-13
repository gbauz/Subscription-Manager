import { Component } from '@angular/core';

/**
 * TODO: Componente de dialogo de confirmacion
 *
 * ============================================================
 * INSTRUCCIONES
 * ============================================================
 *
 * 1. INPUTS:
 *    - title: string (ej: "Eliminar suscripcion")
 *    - message: string (ej: "Estas seguro de eliminar Netflix?")
 *    - confirmText: string (ej: "Eliminar", default: "Confirmar")
 *    - cancelText: string (ej: "Cancelar", default: "Cancelar")
 *
 * 2. OUTPUTS:
 *    - confirm: EventEmitter<void> (emitido al presionar boton de confirmar)
 *    - cancel: EventEmitter<void> (emitido al presionar cancelar o overlay)
 *
 * 3. DISEÑO:
 *    - Overlay oscuro semi-transparente que cubre toda la pantalla
 *    - Card centrada con titulo, mensaje y dos botones
 *    - Boton confirmar: @include btn-primary (o danger style si es eliminacion)
 *    - Boton cancelar: @include btn-secondary
 *    - Cerrar al hacer clic en el overlay o presionar Escape
 *
 * REFERENCIA: _mixins.scss para los estilos de botones
 * ============================================================
 */
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [],
  template: `
    <div style="padding: 2rem; text-align: center;">
      <p style="color: #737785;">Dialogo de confirmacion pendiente</p>
    </div>
  `,
  styles: ``
})
export class ConfirmDialogComponent {
  // TODO: Implementar
}

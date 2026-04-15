import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss'
})
export class EmptyStateComponent {
  icon = input('inbox');
  title = input('No hay datos disponibles');
  description = input('Todavía no hay elementos para mostrar.');
}

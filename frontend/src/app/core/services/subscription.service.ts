import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subscription, SubscriptionStats } from '../models/subscription.model';
import { environment } from '../../../environments/environment';

/*
  1. Completar el servicio HTTP
  Archivo: src/app/core/services/subscription.service.ts

  Los métodos getAll(), getStats() y getById() ya estaban hechos.
  Lo que faltaba era implementar:

  - create()  -> POST
  - update()  -> PUT
  - delete()  -> DELETE

  Qué se esperaba:
  - Usar HttpClient
  - Usar generics de TypeScript
  - Armar bien las URLs
  - Mantener el tipado correcto

  Lo que se hizo:
  - En create() se usó this.http.post<Subscription>()
  - En update() se usó this.http.put<Subscription>()
  - En delete() se usó this.http.delete<void>()
  - En update() y delete() se agregó /${id} a la URL
  - Se respetó el mismo patrón usado en getAll(), getStats() y getById()
*/

@Injectable({ providedIn: 'root' })
export class SubscriptionService {

  // Se inyecta HttpClient para poder hacer solicitudes HTTP al backend.
  // Este servicio nos permite usar GET, POST, PUT y DELETE.
  private http = inject(HttpClient);

  // URL base del recurso subscriptions.
  // Ejemplo:
  // http://localhost:3000/api/subscriptions
  private apiUrl = `${environment.apiUrl}/api/subscriptions`;

  // GET: obtiene todas las suscripciones
  // Retorna un Observable con un arreglo de Subscription.
  getAll(): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(this.apiUrl);
  }

  // GET: obtiene el resumen o estadísticas de suscripciones
  // La URL final será:
  // /api/subscriptions/stats/summary
  // Retorna un Observable de tipo SubscriptionStats.
  getStats(): Observable<SubscriptionStats> {
    return this.http.get<SubscriptionStats>(`${this.apiUrl}/stats/summary`);
  }

  // GET: obtiene una suscripción por su id
  // La URL final será:
  // /api/subscriptions/{id}
  // Retorna un Observable de tipo Subscription.
  getById(id: number): Observable<Subscription> {
    return this.http.get<Subscription>(`${this.apiUrl}/${id}`);
  }

  // POST: crea una nueva suscripción
  //
  // Omit<Subscription, 'id' | 'createdAt'>
  // significa que se usa el modelo Subscription,
  // pero sin los campos 'id' y 'createdAt',
  // porque normalmente esos campos los genera el backend.
  //
  // Se usa el generic <Subscription> para indicar
  // que la respuesta esperada del backend será una suscripción.
  //
  // URL usada:
  // /api/subscriptions
  create(subscription: Omit<Subscription, 'id' | 'createdAt'>): Observable<Subscription> {
    return this.http.post<Subscription>(this.apiUrl, subscription);
  }

  // PUT: actualiza una suscripción existente
  //
  // Recibe:
  // - id: identificador del registro que se va a actualizar
  // - subscription: datos a modificar
  //
  // Partial<Subscription> significa que se pueden enviar
  // solo algunos campos del modelo, no necesariamente todos.
  //
  // Se usa el generic <Subscription> para indicar
  // que la respuesta esperada será la suscripción actualizada.
  //
  // URL usada:
  // /api/subscriptions/{id}
  update(id: number, subscription: Partial<Subscription>): Observable<Subscription> {
    return this.http.put<Subscription>(`${this.apiUrl}/${id}`, subscription);
  }

  // DELETE: elimina una suscripción por su id
  //
  // Se usa el generic <void> porque normalmente en un delete
  // no se espera que el backend devuelva un objeto,
  // sino solo confirmar que la operación se realizó.
  //
  // URL usada:
  // /api/subscriptions/{id}
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

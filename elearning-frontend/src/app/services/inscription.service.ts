import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Inscription } from '../models/inscription';

@Injectable({ providedIn: 'root' })
export class InscriptionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/inscription-service`;

  enroll(inscription: Inscription): Observable<Inscription> {
    return this.http.post<Inscription>(`${this.baseUrl}/inscriptions`, inscription);
  }

  enrollByIds(etudiantId: number, coursId: number): Observable<Inscription> {
    return this.enroll({ etudiantId, coursId });
  }

  createInscription(inscription: Inscription): Observable<Inscription> {
    return this.enroll(inscription);
  }

  listLatest(): Observable<Inscription[]> {
    return this.http.get<Inscription[]>(`${this.baseUrl}/inscriptions`);
  }
}

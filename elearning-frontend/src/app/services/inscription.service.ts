import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Inscription } from '../models/inscription';

@Injectable({ providedIn: 'root' })
export class InscriptionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8888/inscription-service';

  enroll(inscription: Inscription): Observable<Inscription> {
    return this.http.post<Inscription>(`${this.baseUrl}/inscriptions`, inscription);
  }

  enrollByIds(etudiantId: number, coursId: number): Observable<Inscription> {
    return this.enroll({ etudiantId, coursId });
  }

  createInscription(inscription: Inscription): Observable<Inscription> {
    return this.enroll(inscription);
  }
}

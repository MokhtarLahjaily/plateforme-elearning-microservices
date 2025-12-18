import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Cours } from '../models/cours';
import { Etudiant } from '../models/etudiant';
import { Professeur } from '../models/professeur';

@Injectable({ providedIn: 'root' })
export class CoursService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8888/cours-service';

  getCourses(): Observable<Cours[]> {
    return this.http.get<unknown>(`${this.baseUrl}/courses`).pipe(
      map((res) => this.extractCollection<Cours>(res, 'courses'))
    );
  }

  getCourse(id: number): Observable<Cours> {
    return this.http.get<Cours>(`${this.baseUrl}/courses/${id}`);
  }

  getStudents(): Observable<Etudiant[]> {
    return this.http.get<unknown>(`${this.baseUrl}/students`).pipe(
      map((res) => this.extractCollection<Etudiant>(res, 'students'))
    );
  }

  getProfessors(): Observable<Professeur[]> {
    return this.http.get<unknown>(`${this.baseUrl}/professors`).pipe(
      map((res) => this.extractCollection<Professeur>(res, 'professors'))
    );
  }

  private extractCollection<T>(res: unknown, key: string): T[] {
    if (Array.isArray(res)) {
      return res as T[];
    }

    if (res && typeof res === 'object') {
      const embedded = (res as Record<string, unknown>)._embedded as
        | Record<string, unknown>
        | undefined;
      const collection = embedded?.[key];

      if (Array.isArray(collection)) {
        return collection as T[];
      }
    }

    return [];
  }
}

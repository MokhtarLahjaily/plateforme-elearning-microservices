import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cours } from '../models/cours';
import { Etudiant } from '../models/etudiant';
import { Professeur } from '../models/professeur';

@Injectable({ providedIn: 'root' })
export class CoursService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/cours-service/api`;
  private readonly listParams = 'size=100&sort=id,desc';

  getCourses(): Observable<Cours[]> {
    return this.http.get<unknown>(`${this.baseUrl}/courses?${this.listParams}&projection=fullCourse`).pipe(
      map((res) => this.extractCollection<Cours>(res, 'courses'))
    );
  }

  getCourse(id: number): Observable<Cours> {
    return this.http.get<Cours>(`${this.baseUrl}/courses/${id}?projection=fullCourse`);
  }

  createCourse(payload: unknown): Observable<Cours> {
    return this.http.post<Cours>(`${this.baseUrl}/courses`, payload);
  }

  getStudents(): Observable<Etudiant[]> {
    return this.http.get<unknown>(`${this.baseUrl}/students?${this.listParams}`).pipe(
      map((res) => this.extractCollection<Etudiant>(res, 'students'))
    );
  }

  createStudent(payload: Partial<Etudiant>): Observable<Etudiant> {
    return this.http.post<Etudiant>(`${this.baseUrl}/students`, payload);
  }

  getStudentById(id: number): Observable<Etudiant> {
    return this.http.get<Etudiant>(`${this.baseUrl}/students/${id}`);
  }

  getProfessors(): Observable<Professeur[]> {
    return this.http.get<unknown>(`${this.baseUrl}/professors?${this.listParams}`).pipe(
      map((res) => this.extractCollection<Professeur>(res, 'professors'))
    );
  }

  getProfessorById(id: number): Observable<Professeur> {
    return this.http.get<Professeur>(`${this.baseUrl}/professors/${id}`);
  }

  getCoursesByStudent(id: number): Observable<Cours[]> {
    return this.http.get<unknown>(`${this.baseUrl}/courses/search/byStudent?id=${id}&projection=fullCourse`).pipe(
      map((res) => this.extractCollection<Cours>(res, 'courses'))
    );
  }

  getCoursesByProfessor(id: number): Observable<Cours[]> {
    return this.http.get<unknown>(`${this.baseUrl}/courses/search/byProfessor?id=${id}&projection=fullCourse`).pipe(
      map((res) => this.extractCollection<Cours>(res, 'courses'))
    );
  }

  createProfessor(payload: Partial<Professeur>): Observable<Professeur> {
    return this.http.post<Professeur>(`${this.baseUrl}/professors`, payload);
  }

  // Delete methods
  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/courses/${id}`);
  }

  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/students/${id}`);
  }

  deleteProfessor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/professors/${id}`);
  }

  // ✅ UPDATED: Use PUT instead of PATCH as requested
  updateCourse(id: number, cours: any): Observable<Cours> {
    return this.http.put<Cours>(`${this.baseUrl}/courses/${id}`, cours);
  }

  updateStudent(id: number, etudiant: any): Observable<Etudiant> {
    return this.http.put<Etudiant>(`${this.baseUrl}/students/${id}`, etudiant);
  }

  updateProfessor(id: number, prof: any): Observable<Professeur> {
    return this.http.put<Professeur>(`${this.baseUrl}/professors/${id}`, prof);
  }

  // Pagination support
  getPagedCourses(page: number, size: number): Observable<{ items: Cours[], total: number }> {
    return this.http.get<any>(`${this.baseUrl}/courses?page=${page}&size=${size}&sort=id,desc&projection=fullCourse`).pipe(
      map(res => ({
        items: this.extractCollection<Cours>(res, 'courses'),
        total: res.page?.totalElements || 0
      }))
    );
  }

  getPagedStudents(page: number, size: number): Observable<{ items: Etudiant[], total: number }> {
    return this.http.get<any>(`${this.baseUrl}/students?page=${page}&size=${size}&sort=id,desc`).pipe(
      map(res => ({
        items: this.extractCollection<Etudiant>(res, 'students'),
        total: res.page?.totalElements || 0
      }))
    );
  }

  getPagedProfessors(page: number, size: number): Observable<{ items: Professeur[], total: number }> {
    return this.http.get<any>(`${this.baseUrl}/professors?page=${page}&size=${size}&sort=id,desc`).pipe(
      map(res => ({
        items: this.extractCollection<Professeur>(res, 'professors'),
        total: res.page?.totalElements || 0
      }))
    );
  }

  // Association management
  addStudentToCourse(courseId: number, studentUri: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/courses/${courseId}/etudiants`, studentUri, {
      headers: { 'Content-Type': 'text/uri-list' }
    });
  }

  removeStudentFromCourse(courseId: number, studentId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/courses/${courseId}/etudiants/${studentId}`);
  }

  setCourseProfessor(courseId: number, professorUri: string | null): Observable<void> {
    const headers = { 'Content-Type': 'text/uri-list' };
    if (!professorUri) {
      return this.http.delete<void>(`${this.baseUrl}/courses/${courseId}/professeur`);
    }
    return this.http.put<void>(`${this.baseUrl}/courses/${courseId}/professeur`, professorUri, { headers });
  }

  private extractCollection<T>(res: unknown, key: string): T[] {
    if (Array.isArray(res)) {
      return res as T[];
    }

    if (res && typeof res === 'object') {
      const embedded = (res as { _embedded?: Record<string, unknown> })._embedded;
      const collection = embedded?.[key];

      if (Array.isArray(collection)) {
        return collection as T[];
      }
    }

    return [];
  }
}

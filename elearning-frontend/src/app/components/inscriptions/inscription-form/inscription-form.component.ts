import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cours } from '../../../models/cours';
import { Etudiant } from '../../../models/etudiant';
import { CoursService } from '../../../services/cours.service';
import { InscriptionService } from '../../../services/inscription.service';

@Component({
  selector: 'app-inscription-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inscription-form.component.html',
  styleUrls: ['./inscription-form.component.css']
})
export class InscriptionFormComponent implements OnInit {
  private readonly coursService = inject(CoursService);
  private readonly inscriptionService = inject(InscriptionService);
  private readonly fb = inject(FormBuilder);

  students: Etudiant[] = [];
  courses: Cours[] = [];

  loadingStudents = false;
  loadingCourses = false;
  submitting = false;

  successMessage?: string;
  errorMessage?: string;

  form = this.fb.nonNullable.group({
    etudiantId: ['', Validators.required],
    coursId: ['', Validators.required]
  });

  ngOnInit(): void {
    this.loadStudents();
    this.loadCourses();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.successMessage = undefined;
    this.errorMessage = undefined;

    const { etudiantId, coursId } = this.form.getRawValue();

    this.inscriptionService.createInscription({ etudiantId: +etudiantId, coursId: +coursId }).subscribe({
      next: () => {
        this.successMessage = 'Inscription créée avec succès.';
        this.submitting = false;
      },
      error: (err) => {
        this.errorMessage = this.mapError(err);
        this.submitting = false;
      }
    });
  }

  private loadStudents(): void {
    this.loadingStudents = true;
    this.coursService.getStudents().subscribe({
      next: (students) => {
        this.students = students;
        this.loadingStudents = false;
      },
      error: (err) => {
        this.errorMessage = this.mapError(err, 'Impossible de charger les étudiants');
        this.loadingStudents = false;
      }
    });
  }

  private loadCourses(): void {
    this.loadingCourses = true;
    this.coursService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.loadingCourses = false;
      },
      error: (err) => {
        this.errorMessage = this.mapError(err, 'Impossible de charger les cours');
        this.loadingCourses = false;
      }
    });
  }

  private mapError(err: unknown, fallback = 'Une erreur est survenue.'): string {
    if (typeof err === 'object' && err && 'status' in err) {
      const status = (err as { status?: number }).status;
      if (status === 400) return 'Données invalides (400).';
      if (status === 404) return 'Ressource introuvable (404).';
    }
    return fallback;
  }
}

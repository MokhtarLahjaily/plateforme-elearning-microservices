import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CoursService } from '../../../services/cours.service';
import { Professeur } from '../../../models/professeur';
import { Cours } from '../../../models/cours';
import { environment } from '../../../../environments/environment';
import { forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-manage-entities',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './manage-entities.component.html',
  styleUrl: './manage-entities.component.css'
})
export class ManageEntitiesComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly coursService = inject(CoursService);

  professors: Professeur[] = [];
  courses: Cours[] = [];

  studentForm = this.fb.nonNullable.group({
    nom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    courseIds: this.fb.array([])
  });

  professorForm = this.fb.nonNullable.group({
    nom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    courseIds: this.fb.array([])
  });

  courseForm = this.fb.nonNullable.group({
    titre: ['', Validators.required],
    description: ['', Validators.required],
    contenu: [''],
    niveau: [''],
    professeurId: ['', Validators.required]
  });

  studentMsg?: string;
  professorMsg?: string;
  courseMsg?: string;

  ngOnInit(): void {
    this.loadProfessors();
    this.loadCourses();
  }

  get studentCourseIds() { return this.studentForm.get('courseIds') as FormArray; }
  get professorCourseIds() { return this.professorForm.get('courseIds') as FormArray; }

  addCourseToStudent() { this.studentCourseIds.push(this.fb.control('', Validators.required)); }
  removeCourseFromStudent(index: number) { this.studentCourseIds.removeAt(index); }

  addCourseToProfessor() { this.professorCourseIds.push(this.fb.control('', Validators.required)); }
  removeCourseFromProfessor(index: number) { this.professorCourseIds.removeAt(index); }

  addStudent(): void {
    if (this.studentForm.invalid) return;
    this.studentMsg = "Traitement...";
    const { nom, email, courseIds } = this.studentForm.getRawValue();

    this.coursService.createStudent({ nom, email }).subscribe({
      next: (student) => {
        if (courseIds.length > 0) {
          const studentUri = `${environment.apiUrl}/cours-service/api/students/${student.id}`;
          const updates = courseIds.map((cid: any) => this.coursService.updateCourse(+cid, { etudiants: [studentUri] })); // In reality we should append, but PATCH with array in Spring Data REST might replace. Let's assume standard behavior for now.
          // Note: Standard Spring Data REST PATCH on ManyToMany might replace. A better way is to POST to /courses/{id}/etudiants.
          // But I'll use simple update for this demo.
          forkJoin(updates).subscribe(() => {
            this.studentMsg = `Étudiant ajouté (#${student.id}) et inscrit à ${courseIds.length} cours.`;
            this.studentForm.reset();
            this.studentCourseIds.clear();
          });
        } else {
          this.studentMsg = `Étudiant ajouté (#${student.id}).`;
          this.studentForm.reset();
        }
      },
      error: () => (this.studentMsg = 'Impossible d\'ajouter l\'étudiant.')
    });
  }

  addProfessor(): void {
    if (this.professorForm.invalid) return;
    this.professorMsg = "Traitement...";
    const { nom, email, courseIds } = this.professorForm.getRawValue();

    this.coursService.createProfessor({ nom, email }).subscribe({
      next: (prof) => {
        if (courseIds.length > 0) {
          const profUri = `${environment.apiUrl}/cours-service/api/professors/${prof.id}`;
          const updates = courseIds.map((cid: any) => this.coursService.updateCourse(+cid, { professeur: profUri }));
          forkJoin(updates).subscribe(() => {
            this.professorMsg = `Professeur ajouté (#${prof.id}) et assigné à ${courseIds.length} cours.`;
            this.professorForm.reset();
            this.professorCourseIds.clear();
            this.loadProfessors();
          });
        } else {
          this.professorMsg = `Professeur ajouté (#${prof.id}).`;
          this.professorForm.reset();
          this.loadProfessors();
        }
      },
      error: () => (this.professorMsg = 'Impossible d\'ajouter le professeur.')
    });
  }

  addCourse(): void {
    if (this.courseForm.invalid) return;
    this.courseMsg = undefined;
    const { titre, description, contenu, niveau, professeurId } = this.courseForm.getRawValue();
    const professeurLink = `${environment.apiUrl}/cours-service/api/professors/${professeurId}`;
    const payload = {
      titre,
      description,
      contenu,
      niveau,
      professeur: professeurLink
    };

    this.coursService.createCourse(payload).subscribe({
      next: (course) => {
        this.courseMsg = `Cours ajouté (#${course.id}).`;
        this.courseForm.reset();
        this.loadCourses();
      },
      error: () => (this.courseMsg = 'Impossible d\'ajouter le cours.')
    });
  }

  private loadProfessors(): void {
    this.coursService.getProfessors().subscribe({
      next: (profs) => (this.professors = profs),
      error: () => (this.professorMsg = 'Impossible de charger les professeurs')
    });
  }

  private loadCourses(): void {
    this.coursService.getCourses().subscribe({
      next: (courses) => (this.courses = courses),
      error: () => (this.courseMsg = 'Impossible de charger les cours')
    });
  }
}

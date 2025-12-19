import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Cours } from '../../../models/cours';
import { CoursService } from '../../../services/cours.service';
import { forkJoin } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-student-edit',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './student-edit.component.html',
    styleUrl: './student-edit.component.css'
})
export class StudentEditComponent implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly coursService = inject(CoursService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    id!: number;
    courses: Cours[] = [];
    loading = false;
    saving = false;
    error?: string;

    form = this.fb.nonNullable.group({
        nom: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        courseIds: this.fb.array([])
    });

    initialCourseIds: number[] = [];

    get courseIds() { return this.form.get('courseIds') as FormArray; }
    addCourse() { this.courseIds.push(this.fb.control('', Validators.required)); }
    removeCourse(index: number) { this.courseIds.removeAt(index); }

    ngOnInit(): void {
        this.id = Number(this.route.snapshot.paramMap.get('id'));
        this.loadData();
    }

    private loadData(): void {
        this.loading = true;
        this.coursService.getCourses().subscribe(c => this.courses = c);

        this.coursService.getStudentById(this.id).subscribe({
            next: (student) => {
                this.form.patchValue({
                    nom: student.nom,
                    email: student.email
                });

                // Load existing courses
                this.coursService.getCoursesByStudent(this.id).subscribe(cList => {
                    this.initialCourseIds = cList.map(c => c.id);
                    cList.forEach(c => {
                        this.courseIds.push(this.fb.control(c.id.toString(), Validators.required));
                    });
                });

                this.loading = false;
            },
            error: () => {
                this.error = 'Impossible de charger l\'étudiant.';
                this.loading = false;
            }
        });
    }

    submit(): void {
        if (this.form.invalid) return;
        this.saving = true;
        const { nom, email, courseIds } = this.form.getRawValue();

        const payload = {
            nom,
            email,
            cours: courseIds.map(cid => `${environment.apiUrl}/cours-service/api/courses/${cid}`)
        };

        this.coursService.updateStudent(this.id, payload).subscribe({
            next: () => {
                alert('Étudiant mis à jour !');
                this.router.navigate(['/students']);
            },
            error: () => {
                alert('Erreur lors de la mise à jour.');
                this.saving = false;
            }
        });
    }
}

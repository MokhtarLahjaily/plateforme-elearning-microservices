import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CoursService } from '../../../services/cours.service';
import { Professeur } from '../../../models/professeur';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-course-edit',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './course-edit.component.html',
    styleUrl: './course-edit.component.css'
})
export class CourseEditComponent implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly coursService = inject(CoursService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    id!: number;
    professors: Professeur[] = [];
    loading = false;
    saving = false;
    error?: string;

    form = this.fb.nonNullable.group({
        titre: ['', Validators.required],
        description: ['', Validators.required],
        contenu: [''],
        niveau: ['Debutant'],
        professeurId: ['', Validators.required]
    });

    ngOnInit(): void {
        this.id = Number(this.route.snapshot.paramMap.get('id'));
        this.loadInitialData();
    }

    private loadInitialData(): void {
        this.loading = true;
        this.coursService.getProfessors().subscribe(profs => this.professors = profs);

        this.coursService.getCourse(this.id).subscribe({
            next: (course) => {
                this.form.patchValue({
                    titre: course.titre,
                    description: course.description,
                    contenu: course.contenu || '',
                    niveau: course.niveau || 'Debutant',
                    professeurId: course.professeur?.id?.toString() || ''
                });
                this.loading = false;
            },
            error: () => {
                this.error = 'Impossible de charger les données du cours.';
                this.loading = false;
            }
        });
    }

    submit(): void {
        if (this.form.invalid) return;
        this.saving = true;

        const { titre, description, contenu, niveau, professeurId } = this.form.getRawValue();
        const payload = {
            titre,
            description,
            contenu,
            niveau,
            professeur: `${environment.apiUrl}/cours-service/api/professors/${professeurId}`
        };

        this.coursService.updateCourse(this.id, payload).subscribe({
            next: () => {
                alert('Cours mis à jour !');
                this.router.navigate(['/manage-courses']);
            },
            error: () => {
                alert('Erreur lors de la mise à jour.');
                this.saving = false;
            }
        });
    }
}

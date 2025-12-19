import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Professeur } from '../../../models/professeur';
import { CoursService } from '../../../services/cours.service';

@Component({
    selector: 'app-professor-detail',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './professor-detail.component.html',
    styleUrl: './professor-detail.component.css'
})
export class ProfessorDetailComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly coursService = inject(CoursService);

    professor?: Professeur;
    professorCourses: any[] = [];
    loading = false;
    error?: string;

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) {
            this.loadProfessor(id);
            this.loadCourses(id);
        } else {
            this.error = 'Id manquant.';
        }
    }

    private loadProfessor(id: number): void {
        this.loading = true;
        this.coursService.getProfessorById(id).subscribe({
            next: (data) => {
                this.professor = data;
                this.loading = false;
            },
            error: () => {
                this.error = 'Impossible de charger les détails du professeur.';
                this.loading = false;
            }
        });
    }

    private loadCourses(id: number): void {
        this.coursService.getCoursesByProfessor(id).subscribe({
            next: (data) => this.professorCourses = data
        });
    }
}

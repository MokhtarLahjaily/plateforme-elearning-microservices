import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Etudiant } from '../../../models/etudiant';
import { CoursService } from '../../../services/cours.service';

@Component({
    selector: 'app-student-detail',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './student-detail.component.html',
    styleUrl: './student-detail.component.css'
})
export class StudentDetailComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly coursService = inject(CoursService);

    student?: Etudiant;
    studentCourses: any[] = [];
    loading = false;
    error?: string;

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) {
            this.loadStudent(id);
            this.loadCourses(id);
        } else {
            this.error = 'Id manquant.';
        }
    }

    private loadStudent(id: number): void {
        this.loading = true;
        this.coursService.getStudentById(id).subscribe({
            next: (data) => {
                this.student = data;
                this.loading = false;
            },
            error: () => {
                this.error = 'Impossible de charger les détails de l\'étudiant.';
                this.loading = false;
            }
        });
    }

    private loadCourses(id: number): void {
        this.coursService.getCoursesByStudent(id).subscribe({
            next: (data) => this.studentCourses = data
        });
    }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Cours } from '../../../models/cours';
import { CoursService } from '../../../services/cours.service';

@Component({
    selector: 'app-course-admin-list',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './course-admin-list.component.html',
    styleUrl: './course-admin-list.component.css'
})
export class CourseAdminListComponent implements OnInit {
    private readonly coursService = inject(CoursService);

    courses: Cours[] = [];
    loading = false;
    error?: string;

    // Pagination
    currentPage = 0;
    pageSize = 10;
    totalElements = 0;

    ngOnInit(): void {
        this.loadCourses();
    }

    loadCourses(): void {
        this.loading = true;
        this.coursService.getPagedCourses(this.currentPage, this.pageSize).subscribe({
            next: (data) => {
                this.courses = data.items;
                this.totalElements = data.total;
                this.loading = false;
            },
            error: () => {
                this.error = 'Impossible de charger les cours.';
                this.loading = false;
            }
        });
    }

    deleteCourse(id: number): void {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
            this.coursService.deleteCourse(id).subscribe({
                next: () => this.loadCourses(),
                error: () => alert('Erreur lors de la suppression du cours.')
            });
        }
    }

    nextPage(): void {
        if ((this.currentPage + 1) * this.pageSize < this.totalElements) {
            this.currentPage++;
            this.loadCourses();
        }
    }

    prevPage(): void {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.loadCourses();
        }
    }
}

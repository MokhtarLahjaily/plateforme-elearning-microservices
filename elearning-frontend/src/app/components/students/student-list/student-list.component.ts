import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Etudiant } from '../../../models/etudiant';
import { CoursService } from '../../../services/cours.service';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css'
})
export class StudentListComponent implements OnInit {
  private readonly coursService = inject(CoursService);

  students: Etudiant[] = [];
  loading = false;
  error?: string;

  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this.coursService.getPagedStudents(this.currentPage, this.pageSize).subscribe({
      next: (data) => {
        this.students = data.items;
        this.totalElements = data.total;
        this.loading = false;
      },
      error: () => {
        this.error = 'Impossible de charger les étudiants.';
        this.loading = false;
      }
    });
  }

  deleteStudent(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
      this.coursService.deleteStudent(id).subscribe({
        next: () => this.loadStudents(),
        error: () => alert('Impossible de supprimer l\'étudiant.')
      });
    }
  }

  nextPage(): void {
    if ((this.currentPage + 1) * this.pageSize < this.totalElements) {
      this.currentPage++;
      this.loadStudents();
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadStudents();
    }
  }
}

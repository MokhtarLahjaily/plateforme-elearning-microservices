import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Professeur } from '../../../models/professeur';
import { CoursService } from '../../../services/cours.service';

@Component({
  selector: 'app-professor-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './professor-list.component.html',
  styleUrl: './professor-list.component.css'
})
export class ProfessorListComponent implements OnInit {
  private readonly coursService = inject(CoursService);

  professors: Professeur[] = [];
  loading = false;
  error?: string;

  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;

  ngOnInit(): void {
    this.loadProfessors();
  }

  loadProfessors(): void {
    this.loading = true;
    this.coursService.getPagedProfessors(this.currentPage, this.pageSize).subscribe({
      next: (data) => {
        this.professors = data.items;
        this.totalElements = data.total;
        this.loading = false;
      },
      error: () => {
        this.error = 'Impossible de charger les professeurs.';
        this.loading = false;
      }
    });
  }

  deleteProfessor(id: number): void {
    if (confirm('Supprimer ce professeur ?')) {
      this.coursService.deleteProfessor(id).subscribe({
        next: () => this.loadProfessors(),
        error: () => alert('Erreur lors de la suppression.')
      });
    }
  }

  nextPage(): void {
    if ((this.currentPage + 1) * this.pageSize < this.totalElements) {
      this.currentPage++;
      this.loadProfessors();
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadProfessors();
    }
  }
}

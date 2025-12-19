import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Cours } from '../../../models/cours';
import { CoursService } from '../../../services/cours.service';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.css'
})
export class CourseDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly coursService = inject(CoursService);

  course?: Cours;
  loading = false;
  error?: string;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadCourse(id);
    } else {
      this.error = 'Identifiant de cours manquant.';
    }
  }

  private loadCourse(id: number): void {
    this.loading = true;
    this.error = undefined;

    this.coursService.getCourse(id).subscribe({
      next: (course) => {
        this.course = course;
        this.loading = false;
      },
      error: () => {
        this.error = 'Impossible de charger ce cours.';
        this.loading = false;
      }
    });
  }
}

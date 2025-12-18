import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Cours } from '../../../models/cours';
import { CoursService } from '../../../services/cours.service';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {
  private readonly coursService = inject(CoursService);

  courses: Cours[] = [];
  loading = false;
  error?: string;

  ngOnInit(): void {
    this.loadCourses();
  }

  private loadCourses(): void {
    this.loading = true;
    this.error = undefined;

    this.coursService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load courses.';
        this.loading = false;
      }
    });
  }
}

import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: '', redirectTo: 'courses', pathMatch: 'full' },
	{
		path: 'courses',
		loadComponent: () => import('./components/courses/course-list/course-list.component').then(m => m.CourseListComponent)
	},
	{
		path: 'courses/:id',
		loadComponent: () => import('./components/courses/course-detail/course-detail.component').then(m => m.CourseDetailComponent)
	},
	{
		path: 'courses/:id/edit',
		loadComponent: () => import('./components/courses/course-edit/course-edit.component').then(m => m.CourseEditComponent)
	},
	{
		path: 'inscriptions',
		loadComponent: () => import('./components/inscriptions/inscription-form/inscription-form.component').then(m => m.InscriptionFormComponent)
	},
	{
		path: 'manage',
		loadComponent: () => import('./components/manage/manage-entities/manage-entities.component').then(m => m.ManageEntitiesComponent)
	},
	{
		path: 'stats',
		loadComponent: () => import('./components/stats/youtube-search/youtube-search.component').then(m => m.YoutubeSearchComponent)
	},
	{
		path: 'manage-courses',
		loadComponent: () => import('./components/courses/course-admin-list/course-admin-list.component').then(m => m.CourseAdminListComponent)
	},
	{
		path: 'students',
		loadComponent: () => import('./components/students/student-list/student-list.component').then(m => m.StudentListComponent)
	},
	{
		path: 'students/:id',
		loadComponent: () => import('./components/students/student-detail/student-detail.component').then(m => m.StudentDetailComponent)
	},
	{
		path: 'students/:id/edit',
		loadComponent: () => import('./components/students/student-edit/student-edit.component').then(m => m.StudentEditComponent)
	},
	{
		path: 'professors',
		loadComponent: () => import('./components/professors/professor-list/professor-list.component').then(m => m.ProfessorListComponent)
	},
	{
		path: 'professors/:id',
		loadComponent: () => import('./components/professors/professor-detail/professor-detail.component').then(m => m.ProfessorDetailComponent)
	},
	{
		path: 'professors/:id/edit',
		loadComponent: () => import('./components/professors/professor-edit/professor-edit.component').then(m => m.ProfessorEditComponent)
	},
	{ path: '**', redirectTo: 'courses' }
];

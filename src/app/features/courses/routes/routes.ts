import { Routes } from '@angular/router';

export const COURSE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/course-list/course-list.component').then(m => m.CourseListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('../pages/course-form/course-form.component').then(m => m.CourseFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('../pages/course-form/course-form.component').then(m => m.CourseFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('../pages/course-detail/course-detail.component').then(m => m.CourseDetailComponent)
  }
];
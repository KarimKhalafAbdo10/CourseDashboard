import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { Course } from '../../moldels/course';
import { debounceTime, distinctUntilChanged, merge } from 'rxjs';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmModelComponent } from '../../../../shared/components/confirm-model/confirm-model/confirm-model.component';
import { SkeltonLoaderComponent } from '../../../../shared/components/skelton-loader/skelton-loader/skelton-loader.component';
@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule,ConfirmModelComponent,SkeltonLoaderComponent],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
})
export class CourseListComponent implements OnInit {
 // 1. Injected Services
  public service = inject(CourseService);
  public toastr = inject(ToastrService);

  // 2. Form Controls
  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly statusControl = new FormControl('', { nonNullable: true });

  // 3. Reactive State (Signals)
  readonly isModalOpen = signal<boolean>(false);
  readonly selectedCourseId = signal<string | null>(null);

  // 4. Lifecycle Hooks
  ngOnInit(): void {
    this.triggerFetch(); // Initial fetch

    // Merge search & status changes into a single debounced stream
    merge(
      this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()),
      this.statusControl.valueChanges
    ).subscribe(() => this.triggerFetch());
  }

  // 5. Data Fetching & Query Methods
  triggerFetch(): void {
    const search = this.searchControl.value.trim();
    const status = this.statusControl.value.trim();
    this.service.loadCourses(search, status);
  }

  // 6. Delete & Modal Logic
  openDeleteModal(id: string): void {
    this.selectedCourseId.set(id);
    this.isModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.isModalOpen.set(false);
    this.selectedCourseId.set(null);
  }

  handleDelete(): void {
    const id = this.selectedCourseId();
    if (!id) return;

    this.service.deleteCourse(id).subscribe({
      next: () => {
        this.triggerFetch();
        this.toastr.success('Course deleted successfully.', 'Success');
        this.closeDeleteModal();
      },
      error: () => {
        this.toastr.error('An error occurred while deleting the course.', 'Error');
        this.closeDeleteModal();
      }
    });
  }

  // 7. Helper & Utility Methods
  getStatusSummary(courses: Course[] = this.service.courses()): string {
    const counts = courses.reduce<Record<string, number>>((acc, course) => {
      const status = course.status ?? 'Unknown';
      acc[status] = (acc[status] ?? 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([status, count]) => `${count} ${status}`)
      .join(' • ');
  }

  trackByCourseId(_index: number, course: Course): string {
    return course?.id ?? '';
  } 
}
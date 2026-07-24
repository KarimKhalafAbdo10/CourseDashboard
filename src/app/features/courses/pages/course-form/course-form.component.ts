import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss'],
})
export class CourseFormComponent implements OnInit {

  private fb = inject(NonNullableFormBuilder);
  private courseService = inject(CourseService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toaster = inject(ToastrService);

  courseId = signal<string | null>(null);
  isEditMode = signal<boolean>(false);

  courseForm = this.fb.group({
    courseName: ['', [Validators.required, Validators.minLength(3)]],
    instructorName: ['', [Validators.required]],
    category: ['', [Validators.required]],
    duration: [0, [Validators.required, Validators.min(1)]],
    price: [0, [Validators.required, Validators.min(0)]],
    status: ['Active' as 'Active' | 'Draft' | 'Archived', [Validators.required]],
    description: ['', [Validators.maxLength(500)]]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.courseId.set(id);
      this.isEditMode.set(true);
      this.courseService.getCourseById(id).subscribe({
        next: (course) => this.courseForm.patchValue(course),
        error: () => this.router.navigate(['/courses'])
      });
    }
  }

  onSubmit(): void {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      return;
    }

    const rawValue = this.courseForm.getRawValue();
    const formValue = {
      ...rawValue,
      duration: Number(rawValue.duration),
      price: Number(rawValue.price)
    };
const action$ = this.isEditMode()
  ? this.courseService.updateCourse(this.courseId()!, formValue)
  : this.courseService.createCourse(formValue);

// 2. Subscribe and fire toasts inside the appropriate callbacks
action$.subscribe({
  next: () => {
    const message = this.isEditMode()
      ? 'Course updated successfully!'
      : 'Course created successfully!';
    
    this.toaster.success(message);
    this.router.navigate(['/courses']);
  },
  error: (err) => {
    console.error('Submission error:', err);
    this.toaster.error('An error occurred while submitting the form.');
    this.courseForm.setErrors({ submitFailed: true });
  }
});

  }}

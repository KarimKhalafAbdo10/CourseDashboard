import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal, Signal } from '@angular/core';
import { Course } from '../moldels/course';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.production';

@Injectable({
  providedIn: 'root',
})
export class CourseService {

private http = inject(HttpClient);
  private apiUrl = environment.apiUrl ;

  // 1. Private Writable Signals (internal state)
  #courses = signal<Course[]>([]);
  #loading = signal<boolean>(false);
  #error = signal<string | null>(null);

  // 2. Public Readonly Signals (exposed to UI/components)
  public readonly courses: Signal<Course[]> = this.#courses.asReadonly();
  public readonly loading: Signal<boolean> = this.#loading.asReadonly();
  public readonly error: Signal<string | null> = this.#error.asReadonly();

  // Load courses matching JSON Server parameters
  loadCourses(search: string = '', status: string = ''): void {
    this.#loading.set(true);
    this.#error.set(null);

    let params = new HttpParams();

    if (search) {
      params = params.set('courseName:contains', search);
    }

    if (status) {
      params = params.set('status', status);
    }

    this.http.get<Course[]>(this.apiUrl, { params }).subscribe({
      next: (data) => {
        this.#courses.set(data);
        this.#loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching courses:', err);
        this.#error.set('Failed to load courses.');
        this.#loading.set(false);
      },
    });
  }

  getCourseById(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }

  createCourse(course: Omit<Course, 'id' | 'createdDate'>): Observable<Course> {
    const payload = {
      ...course,
      id: crypto.randomUUID(),
      createdDate: new Date().toISOString().split('T')[0],
    };

    return this.http.post<Course>(this.apiUrl, payload).pipe(
      tap((newCourse) => this.#courses.update((list) => [newCourse, ...list]))
    );
  }

  updateCourse(id: string, course: Partial<Course>): Observable<Course> {
    return this.http.patch<Course>(`${this.apiUrl}/${id}`, course).pipe(
      tap((updated) =>
        this.#courses.update((list) =>
          list.map((c) => (c.id === id ? updated : c))
        )
      )
    );
  }

  deleteCourse(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.#courses.update((list) => list.filter((c) => c.id !== id)))
    );
  }
  
}

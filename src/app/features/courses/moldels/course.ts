
export type CourseStatus = 'Active' | 'Draft' | 'Archived';
export interface Course {

    id: string;
  courseName: string;
  instructorName: string;
  category: string;
  duration: number;
  price: number;
  status: CourseStatus;
  description?: string;
  createdDate: string;
}
export interface PaginatedResponse<T> {
  data: T[];
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
}
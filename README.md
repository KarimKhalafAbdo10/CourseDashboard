# Course Management Dashboard

A modern, responsive web application built with **Angular 20**, **Tailwind CSS**, and a **JSON Server** mock backend. Designed with an emphasis on performant state management using Angular Signals, standalone architecture, reactive forms, and modular enterprise components.

---

## 🛠️ Technologies Used

* **Frontend Framework**: Angular 20 (Standalone Components, Signals, Reactive Forms, Router)
* **Styling**: Tailwind CSS
* **Notifications**: `ngx-toastr`
* **Mock Backend**: JSON Server (v1.0.0+)
* **Asynchronous Operations**: RxJS (`debounceTime`, `distinctUntilChanged`, `merge`, `pipe`)
* **Package Manager**: npm

---

## ✨ Features Implemented

* **Signal-Based Architecture**: State management handled cleanly via private signals exposed as read-only state.
* **Course Operations**: Full CRUD functionality for courses (Create, Read, Update, Delete).
* **Search & Dynamic Filtering**: Real-time title search debouncing (300ms) with RxJS, combined with status filtering.
* **Confirmation Modal**: A reusable, accessible modal component for safe deletion workflows.
* **Loading Skeletons**: Tailored skeleton loaders during dynamic data fetching for smooth user transitions.
* **Status Summary Metrics**: Auto-computed badge summary dynamically summarizing course statuses (`Active`, `Draft`, etc.).
* **Form Validation & Notifications**: Reactive Form validation with contextual success/error toast notifications on submission.

---

## 🚀 How to Run the Project

### Prerequisites
Make sure you have Node.js and npm installed on your system.

### 1. Installation
Clone the repository and install all project dependencies:
```bash
npm install
npm run mock-api
npm s --o

# Student Assignment Tracker

Created by Michael Currie.

A frontend application that helps college students organize assignments and track deadlines.

## Features

- Add assignments with a title, course, due date, and priority
- View assignments sorted by due date
- Edit and delete assignments
- Mark assignments as completed
- Filter assignments by course and status
- Highlight overdue assignments
- Save assignments with localStorage
- Use the application on desktop and mobile screens

## Technologies

- HTML
- CSS
- JavaScript
- localStorage
- Visual Studio Code
- Git and GitHub

## Setup

1. Clone or download this repository.
2. Open the project folder in Visual Studio Code.
3. Open index.html in a web browser.
4. Add assignments using the form.

## Usage

Enter an assignment title, course name, due date, and priority.
Select Save Assignment to add it to the list.

Use the assignment buttons to mark an assignment complete,
edit its details, or delete it.

Use the course and status filters to narrow the list.

Pending includes all unfinished assignments, including overdue ones.
Assignments become overdue the day after their due date.

## Data Storage

Assignments are saved using the browser's localStorage.
Data stays in the same browser and does not sync between devices.
Clearing browser storage removes saved assignments.

## Page Outline

1. Header with the application title and description
2. Dashboard with pending, overdue, and completed counts
3. Assignment form
4. Course and status filters
5. Assignment list with action buttons
6. Empty-state message when no assignments are displayed

## Project Plan

1. Set up the repository and initial files.
2. Build the HTML structure.
3. Style the interface and responsive layout.
4. Implement assignment actions with JavaScript.
5. Add filtering, deadline indicators, and localStorage.
6. Test functionality, keyboard navigation, and mobile layouts.

## Files

- README.md: Project overview and instructions
- index.html: Page structure and form
- styles.css: Styling and responsive layout
- script.js: Assignment actions, filtering, and storage

## Repository

- https://github.com/michael927001/student-assignment-tracker

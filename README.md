# Student Assignment Tracker

Created by Michael Currie.

A responsive frontend application that helps college students organize assignments and track deadlines.

## Live Application

https://michael927001.github.io/student-assignment-tracker/

## GitHub Repository

https://github.com/michael927001/student-assignment-tracker

## Features

- Add assignments with a title, course, due date, and priority
- Edit and delete assignments
- Mark assignments as completed or pending
- Sort assignments by due date
- Filter assignments by course and status
- Highlight overdue, pending, and completed assignments
- Display dashboard totals
- Load sample assignments from a local JSON data source
- Prevent duplicate sample data
- Save assignments with localStorage
- Display loading, success, and error feedback
- Support desktop and mobile screen sizes

## Technologies

- HTML
- CSS
- JavaScript
- JSON
- Fetch API
- localStorage
- Git and GitHub
- GitHub Pages

## Project Structure

- `index.html`: Semantic page structure, navigation, form, filters, and assignment list
- `styles.css`: Colors, spacing, cards, buttons, focus styles, and responsive layout
- `script.js`: Application state, validation, events, filtering, storage, and data loading
- `components.js`: Reusable assignment-card, course-option, and button components
- `sample-assignments.json`: Sample assignment data loaded with the Fetch API
- `README.md`: Project instructions and documentation

## Running the Project Locally

1. Clone or download the repository.
2. Open the project folder in Visual Studio Code.
3. Install the Live Server extension if necessary.
4. Right-click `index.html`.
5. Select **Open with Live Server**.

The project should be run through Live Server because it uses JavaScript modules and the Fetch API.

## Usage

Enter an assignment title, course name, due date, and priority, and then select **Save Assignment**. Use the assignment buttons to complete, edit, or delete an assignment. Use the course and status filters to narrow the list.

Select **Load Sample Assignments** to retrieve sample data from the JSON file. Assignments are stored in the browser using localStorage and remain available after refreshing the page.

## Accessibility

The application includes:

- Semantic HTML sections
- Visible form labels
- Keyboard-accessible controls
- A skip-navigation link
- Visible focus indicators
- Text labels in addition to status colors
- Live status messages for application feedback
- Responsive layouts for smaller screens

## Testing Summary

The final application was tested for:

- Adding, editing, completing, and deleting assignments
- Required-field and whitespace validation
- Course and status filtering
- Dashboard count updates
- Overdue deadline calculations
- localStorage persistence after refreshing
- JSON sample-data loading
- Duplicate-data prevention
- Data-loading error feedback
- Keyboard navigation and focus behavior
- Desktop and mobile responsiveness
- Working navigation links
- JavaScript and JSON syntax errors

All major planned features worked correctly during final testing.
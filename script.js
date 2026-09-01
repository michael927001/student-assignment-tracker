const STORAGE_KEY = "studentAssignmentTracker";

const assignmentForm = document.querySelector("#assignment-form");
const assignmentIdInput = document.querySelector("#assignment-id");
const titleInput = document.querySelector("#title");
const courseInput = document.querySelector("#course");
const dueDateInput = document.querySelector("#due-date");
const priorityInput = document.querySelector("#priority");
const formHeading = document.querySelector("#form-heading");
const submitButton = document.querySelector("#submit-button");
const cancelButton = document.querySelector("#cancel-button");
const assignmentList = document.querySelector("#assignment-list");
const emptyState = document.querySelector("#empty-state");
const courseFilter = document.querySelector("#course-filter");
const statusFilter = document.querySelector("#status-filter");
const pendingCount = document.querySelector("#pending-count");
const overdueCount = document.querySelector("#overdue-count");
const completedCount = document.querySelector("#completed-count");
const feedback = document.querySelector("#feedback");

let assignments = loadAssignments();

assignmentForm.addEventListener("submit", handleFormSubmit);
cancelButton.addEventListener("click", resetForm);
courseFilter.addEventListener("change", render);
statusFilter.addEventListener("change", render);
assignmentList.addEventListener("click", handleAssignmentAction);

[titleInput, courseInput].forEach((input) => {
  input.addEventListener("input", () => {
    input.setCustomValidity("");
  });
});

render();

// Refresh deadline indicators when the tab becomes active.
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    render();
  }
});

function handleFormSubmit(event) {
  event.preventDefault();

  for (const input of [titleInput, courseInput]) {
    input.setCustomValidity(
      input.value.trim() ? "" : "Please enter text, not just spaces."
    );
  }

  if (!assignmentForm.reportValidity()) {
    return;
  }

  const assignmentData = {
    title: titleInput.value.trim(),
    course: courseInput.value.trim(),
    dueDate: dueDateInput.value,
    priority: priorityInput.value
  };

  const assignmentId = assignmentIdInput.value;
  const editing = Boolean(assignmentId);

  if (editing) {
    assignments = assignments.map((assignment) => {
      return assignment.id === assignmentId
        ? { ...assignment, ...assignmentData }
        : assignment;
    });
  } else {
    assignments.push({
      id: createId(),
      ...assignmentData,
      completed: false
    });
  }

  persistChanges(editing ? "Assignment updated." : "Assignment added.");
  resetForm();
  render();
}

function handleAssignmentAction(event) {
  const button = event.target.closest("button");

  if (!button) {
    return;
  }

  const assignmentId = button.dataset.id;
  const action = button.dataset.action;

  if (action === "complete") {
    toggleCompleted(assignmentId);
  } else if (action === "edit") {
    startEditing(assignmentId);
  } else if (action === "delete") {
    deleteAssignment(assignmentId);
  }
}

function toggleCompleted(assignmentId) {
  assignments = assignments.map((assignment) => {
    return assignment.id === assignmentId
      ? { ...assignment, completed: !assignment.completed }
      : assignment;
  });

  persistChanges("Assignment status updated.");
  render();
  restoreActionFocus(assignmentId, "complete");
}

function startEditing(assignmentId) {
  const assignment = assignments.find((item) => item.id === assignmentId);

  if (!assignment) {
    return;
  }

  titleInput.setCustomValidity("");
  courseInput.setCustomValidity("");

  assignmentIdInput.value = assignment.id;
  titleInput.value = assignment.title;
  courseInput.value = assignment.course;
  dueDateInput.value = assignment.dueDate;
  priorityInput.value = assignment.priority;

  formHeading.textContent = "Edit Assignment";
  submitButton.textContent = "Update Assignment";
  cancelButton.hidden = false;
  titleInput.focus();
}

function deleteAssignment(assignmentId) {
  const assignment = assignments.find((item) => item.id === assignmentId);

  if (!assignment || !window.confirm(`Delete "${assignment.title}"?`)) {
    return;
  }

  assignments = assignments.filter((item) => item.id !== assignmentId);

  if (assignmentIdInput.value === assignmentId) {
    resetForm();
  }

  persistChanges("Assignment deleted.");
  render();

  const nextButton = assignmentList.querySelector("button");
  (nextButton || titleInput).focus();
}

function resetForm() {
  assignmentForm.reset();
  assignmentIdInput.value = "";
  titleInput.setCustomValidity("");
  courseInput.setCustomValidity("");

  formHeading.textContent = "Add Assignment";
  submitButton.textContent = "Save Assignment";
  cancelButton.hidden = true;
  titleInput.focus();
}

function render() {
  updateSummary();
  updateCourseFilter();
  renderAssignments();
}

function updateSummary() {
  pendingCount.textContent = assignments.filter(
    (assignment) => !assignment.completed
  ).length;

  overdueCount.textContent = assignments.filter(isOverdue).length;

  completedCount.textContent = assignments.filter(
    (assignment) => assignment.completed
  ).length;
}

function updateCourseFilter() {
  const selectedCourse = courseFilter.value;

  const courses = [...new Set(assignments.map((item) => item.course))]
    .sort((first, second) => first.localeCompare(second));

  courseFilter.replaceChildren(new Option("All Courses", ""));

  courses.forEach((course) => {
    courseFilter.add(new Option(course, course));
  });

  courseFilter.value = courses.includes(selectedCourse)
    ? selectedCourse
    : "";
}

function renderAssignments() {
  const visibleAssignments = getFilteredAssignments();

  emptyState.hidden = visibleAssignments.length > 0;
  emptyState.textContent = assignments.length === 0
    ? "No assignments have been added yet. Add your first assignment above."
    : "No assignments match your selected filters.";

  assignmentList.innerHTML = visibleAssignments
    .map(createAssignmentCard)
    .join("");
}

function getFilteredAssignments() {
  const selectedCourse = courseFilter.value;
  const selectedStatus = statusFilter.value;

  return assignments
    .filter((assignment) => {
      const matchesCourse =
        selectedCourse === "" || assignment.course === selectedCourse;

      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "completed" && assignment.completed) ||
        (selectedStatus === "pending" && !assignment.completed) ||
        (selectedStatus === "overdue" && isOverdue(assignment));

      return matchesCourse && matchesStatus;
    })
    .sort((first, second) => first.dueDate.localeCompare(second.dueDate));
}

function createAssignmentCard(assignment) {
  const status = assignment.completed
    ? "Completed"
    : isOverdue(assignment)
      ? "Overdue"
      : "Pending";

  const statusClass = status.toLowerCase();
  const safeId = escapeHtml(assignment.id);

  return `
    <article class="assignment-card ${statusClass}">
      <h3>${escapeHtml(assignment.title)}</h3>

      <p class="assignment-meta">
        <strong>Course:</strong> ${escapeHtml(assignment.course)}
      </p>

      <p class="assignment-meta">
        <strong>Due:</strong> ${escapeHtml(formatDate(assignment.dueDate))}
      </p>

      <p class="assignment-meta">
        <strong>Priority:</strong> ${escapeHtml(assignment.priority)}
      </p>

      <p class="assignment-status status-${statusClass}">
        Status: ${status}
      </p>

      <div class="assignment-actions">
        <button
          type="button"
          data-action="complete"
          data-id="${safeId}"
        >
          ${assignment.completed ? "Mark Pending" : "Mark Complete"}
        </button>

        <button
          type="button"
          data-action="edit"
          data-id="${safeId}"
          class="secondary-button"
        >
          Edit
        </button>

        <button
          type="button"
          data-action="delete"
          data-id="${safeId}"
          class="delete-button"
        >
          Delete
        </button>
      </div>
    </article>
  `;
}

function isOverdue(assignment) {
  if (assignment.completed) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(`${assignment.dueDate}T00:00:00`);
  return dueDate < today;
}

function formatDate(dateString) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function loadAssignments() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed) || !parsed.every(isValidAssignment)) {
      throw new Error("Saved assignment data is invalid.");
    }

    return parsed;
  } catch (error) {
    console.error("Unable to load assignments:", error);
    feedback.textContent =
      "Saved assignments could not be loaded. Browser storage may be unavailable or contain invalid data.";
    return [];
  }
}

function isValidAssignment(item) {
  return (
    item !== null &&
    typeof item === "object" &&
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    typeof item.course === "string" &&
    typeof item.dueDate === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(item.dueDate) &&
    !Number.isNaN(new Date(`${item.dueDate}T00:00:00`).getTime()) &&
    ["Low", "Medium", "High"].includes(item.priority) &&
    typeof item.completed === "boolean"
  );
}

function persistChanges(message) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
    feedback.textContent = message;
  } catch (error) {
    console.error("Unable to save assignments:", error);
    feedback.textContent =
      `${message} Browser storage is unavailable, so this change will be lost when you reload or close the page.`;
  }
}

function restoreActionFocus(assignmentId, action) {
  const buttons = [...assignmentList.querySelectorAll("button")];
  const button = buttons.find((item) => {
    return item.dataset.id === assignmentId && item.dataset.action === action;
  });

  (button || statusFilter).focus();
}

function createId() {
  if (window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
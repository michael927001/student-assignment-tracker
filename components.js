// Reusable frontend components

export function createCourseOption(course) {
  return new Option(course || "All Courses", course);
}

export function createAssignmentCard(assignment, status, formattedDate) {
  const statusClass = status.toLowerCase();
  const safeId = escapeHtml(assignment.id);

  return `
    <article class="assignment-card ${statusClass}">
      <h3>${escapeHtml(assignment.title)}</h3>

      <p class="assignment-meta">
        <strong>Course:</strong> ${escapeHtml(assignment.course)}
      </p>

      <p class="assignment-meta">
        <strong>Due:</strong> ${escapeHtml(formattedDate)}
      </p>

      <p class="assignment-meta">
        <strong>Priority:</strong> ${escapeHtml(assignment.priority)}
      </p>

      <p class="assignment-status status-${statusClass}">
        Status: ${escapeHtml(status)}
      </p>

      <div class="assignment-actions">
        ${createActionButton(
          "complete",
          safeId,
          assignment.completed ? "Mark Pending" : "Mark Complete"
        )}

        ${createActionButton(
          "edit",
          safeId,
          "Edit",
          "secondary-button"
        )}

        ${createActionButton(
          "delete",
          safeId,
          "Delete",
          "delete-button"
        )}
      </div>
    </article>
  `;
}

function createActionButton(action, assignmentId, label, className = "") {
  return `
    <button
      type="button"
      data-action="${action}"
      data-id="${assignmentId}"
      class="${className}"
    >
      ${escapeHtml(label)}
    </button>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
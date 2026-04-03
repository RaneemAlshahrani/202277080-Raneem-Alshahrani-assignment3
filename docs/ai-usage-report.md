
# AI Usage Report

## Overview
This report documents how AI tools were used during the development of the personal portfolio website. AI was used as a support tool for debugging, optimization, UI improvements, and implementing interactive features required for Assignment 2 such as dynamic content handling, data validation, and user feedback.

All AI suggestions were reviewed, modified when necessary, and tested before being integrated into the final implementation.

## AI Tools Used

**ChatGPT**:
* Debugging layout and JavaScript issues
* Implementing dynamic features (filtering and sorting projects)
* Integrating EmailJS for sending emails
* Improving form validation and user feedback
* Explaining modern browser APIs

**Claude AI**:
* Reviewing CSS structure
* Identifying redundant rules
* Suggesting performance and accessibility improvements

## Effective Use of AI

AI tools were used meaningfully to solve specific development challenges rather than to generate the entire project.

### 1. Theme Toggle with Persistence

AI suggested using `localStorage` to preserve user preference.

```javascript
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}
```

This ensured consistent user experience across sessions.

### 2. Performance-Optimized Scroll Animations

Instead of using scroll event listeners, AI recommended `IntersectionObserver`.

```javascript
const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      obs.unobserve(entry.target);
    }
  });
});
```

This reduced unnecessary computations and improved performance.

### 3. Dynamic Project Filtering and Sorting

**Problem**: Displaying projects dynamically based on user selection.
**AI Role**: Suggested filtering using dataset attributes and updating the DOM without reloading.

```javascript
function filterProjects() {
  const category = filterSelect.value;

  let visible = projects.filter(p => {
    const cat = p.dataset.category;
    return category === 'all' || cat === category;
  });

  visible.forEach(p => projectGrid.appendChild(p));
}
```

**Benefit**:

* Real-time updates
* Improved interactivity
* Meets dynamic content requirement

### 4. EmailJS Integration (Data Handling)

**Problem**: Sending real emails without a backend server.
**AI Role**: Guided integration of EmailJS.

```javascript
await emailjs.send("service_id", "template_id", {
  from_name: name,
  from_email: email,
  subject: subject,
  message: message
});
```

**Benefit**:

* Real email sending functionality
* No backend required
* Meets data handling requirement

### 5. Form Validation and User Feedback

**Problem**: Ensuring valid input and clear feedback.
**AI Role**: Suggested validation logic and feedback messages.

```javascript
if (!emailRegex.test(email)) {
  showFeedback('Please enter a valid email address.', 'error');
}
```

**Benefit**:

* Prevents invalid input
* Improves user experience
* Meets error handling requirement

## Learning Outcomes

### CSS Concepts Learned:

* Using CSS variables for theming
* Responsive layout using Flexbox and Grid
* Accessibility improvements (contrast, reduced motion)

### JavaScript Concepts Learned:

* DOM manipulation and event handling
* Using `localStorage` for persistence
* Implementing filtering and sorting logic
* Integrating third-party APIs (EmailJS)
* Handling errors and user feedback

## Benefits & Challenges

### Benefits

* Faster debugging and problem-solving
* Improved code structure and readability
* Better understanding of modern JavaScript techniques

### Challenge 1: Dynamic Filtering Not Working

* Problem: JavaScript errors stopped filtering
* AI Role: Helped identify undefined variables and fix logic
* Benefit: Correct dynamic behavior and bug-free interaction

### Challenge 2: Email Sending Errors

* Problem: EmailJS returned errors (400 status)
* AI Role: Identified mismatched template variables
* Benefit: Successful email delivery and improved debugging skills

## Responsible Use & Modifications

* All AI-generated code was reviewed and rewritten where necessary
* Suggestions were validated through testing and documentation
* Only understood implementations were used
* Code was adapted to fit project requirements

AI enhanced development while maintaining academic integrity and full ownership.

## Innovation

AI was used creatively to improve both functionality and user experience:

* Implementing dynamic filtering and sorting of projects
* Integrating EmailJS for real email functionality
* Enhancing user feedback with clear success/error messages
* Using IntersectionObserver for efficient animations

AI acted as a learning assistant rather than replacing development effort.

## Conclusion

AI tools supported debugging, optimization, dynamic feature implementation, and data handling throughout the project. Their integration improved development efficiency while preserving originality, learning outcomes, and full ownership of the final implementation.

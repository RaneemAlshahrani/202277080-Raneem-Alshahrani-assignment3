# Technical Documentation

## Overview
This project is a front-end personal portfolio website developed to present academic background, technical skills, and completed projects in a structured and accessible format. The system is designed to provide a clean, easy-to-use interface for presenting projects and skills.

The website runs primarily on the client side and uses a third-party service (EmailJS) to handle contact form submissions and send emails without requiring a custom backend.

### Scope

* Front-end only (HTML, CSS, JavaScript)
* No custom backend or database integration
* Uses EmailJS as an external service for sending emails
* Uses GitHub API for repositories
* Optimized for desktop and mobile browsers

## Architecture

### System Design and Components

The system follows a static front-end architecture composed of:

* **HTML**: Semantic structure of the website
* **CSS**: Layout, theming (light/dark mode), animations, and responsiveness
* **JavaScript**: UI interactivity and state management

* The layout is fully responsive using CSS Grid, Flexbox, and media queries.

### Folder Structure

```
202277080-Raneem-Alshahrani-assignment3/
├── README.md
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── assets/
│   └── images/
├── docs/
│   ├── ai-usage-report.md
│   └── technical-documentation.md
└── .gitignore

```
This structure separates content, styling, logic, and documentation for better maintainability.

### Main Components

* Navigation Bar
* Hero Section
* About Section
* Projects Section
* Skills Section
* Contact Form
* Footer

Accessibility considerations include semantic HTML, ARIA attributes, and reduced-motion support.

### User Interaction Flow

* User actions (clicks, toggles, navigation) trigger JavaScript event listeners

* Interface preferences (such as theme or font size) are saved using `localStorage`

* The system updates the UI dynamically without page reload

* Form data is sent securely to EmailJS to deliver messages to the portfolio owner via email.

## Dynamic Content

The website includes interactive features where content updates dynamically based on user actions.

### Implemented Features

* **Project Filtering**
  - Users can filter projects by category (Web, Database, Requirements, AI)
  - The displayed project cards update instantly without page reload

* **Project Sorting**
  - Users can sort projects by:
    - Date (descending)
    - Name (alphabetical)
  - The order of project cards updates dynamically

* **Empty State Handling**
  - When no project matches the selected filter, a message is displayed:
    - "No projects found"

These features improve usability by allowing users to explore projects efficiently.

## Data Handling

The application demonstrates client-side data handling using JavaScript.

### Implemented Features

* **Local Storage**
  - Theme preference (light/dark mode) is saved
  - Font size preference is saved
  - Visitor name is stored for personalization
  - Preferences persist across page reloads


* **Session Storage**
  - Tracks how long a visitor has been on the site during a session
  
* **Form Validation**
  - The contact form validates:
    - Required fields
    - Email format using regular expressions
  - Invalid input triggers error messages

* **Email Sending (EmailJS)**
  - Form data is sent to EmailJS
  - Emails are delivered to the portfolio owner
  - Auto-reply is sent to the user

* **Error Handling**
  - If email sending fails, a message is displayed:
    - "Failed to send message. Please try again."

## Animation and Transitions

The website includes smooth animations to improve user experience.

### Implemented Features

* **Scroll Reveal Animation**
  - Sections fade and slide into view when scrolling
  - Implemented using IntersectionObserver

* **Hover Effects**
  - Buttons, project cards, and links respond visually on hover

* **Form Feedback Animation**
  - Success and error messages appear with smooth transitions

These animations enhance interactivity while maintaining performance and usability.

## Error Handling and User Feedback

The application provides clear feedback for user actions.

### Implemented Feedback

* **Form Validation Errors**
  - Empty fields → "Please fill in all fields"
  - Invalid email → "Please enter a valid email address"

* **Success Messages**
  - Displayed after successful form submission

* **Failure Messages**
  - Displayed if email sending fails

* **Empty State**
  - "No projects found" when filters return no results

These messages ensure the user always understands what is happening.

## Installation

### Prerequisites

* A modern web browser (Chrome, Firefox, Edge, Safari)
* Optional: VS Code with Live Server extension for local development

### Setup Instructions

1. Download or clone the repository.
2. Ensure all project folders remain in the same directory structure.

```
202277080-Raneem-Alshahrani-assignment3/
├── README.md
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── assets/
│   └── images/
├── docs/
│   ├── ai-usage-report.md
│   └── technical-documentation.md
└── .gitignore

```

3. Open `index.html` directly in a browser **or**
4. Use the Live Server extension in VS Code for local development.

No additional configuration is required.

## Configuration

* No environment variables required
* Theme and font preferences are automatically saved in the browser

## Usage

### How to Use the Website

* Navigate using the top navigation bar
* Scroll to view different sections
* Use buttons in the navigation bar to:

  * Toggle Light/Dark Mode
  * Increase/Decrease Font Size
  * Open Mobile Menu (on small screens)

### Common Workflows

* **Viewing Projects**: Scroll to the Projects section
* **Changing Theme**: Click the moon/sun icon
* **Mobile Navigation**: Click ☰ on mobile view
* **Contacting**: Fill out the contact form to send an email
* **Example User Interaction**:
  - Select "AI" in the project filter → Only AI projects are displayed
  - Select a category with no results → "No projects found" message appears

  - Click "Sort by Date" → Projects reorder from newest to oldest
  - Click "Sort by Name" → Projects reorder alphabetically

  - Submit the contact form with missing fields → Error message is shown
  - Submit with valid input → Success message appears and email is sent
  
## API Reference

This project uses a third-party API service (EmailJS) for sending emails.

### EmailJS Integration

* Sends contact form data via JavaScript
* No backend server required
* Handles:
  - Email delivery
  - Auto-reply functionality

Example:

```js
emailjs.send(serviceID, templateID, {
  from_name,
  from_email,
  subject,
  message
});
```

### Internal JavaScript Functions (Examples)

* `applyTheme(theme)` – switches between light and dark modes
* `openMenu()` / `closeMenu()` – controls mobile menu visibility
* `IntersectionObserver` – triggers scroll-based animations

## Troubleshooting

### Common Issues

* **Issue**: Dark icons not visible in dark mode  
  **Solution**: Apply the `dark-invert` CSS class to black icons

* **Issue**: Mobile menu does not close  
  **Solution**: Ensure the `.hidden` class is applied correctly and JavaScript event listeners are active

* **Issue**: Theme or font size resets on refresh  
  **Solution**: Verify `localStorage` access is not blocked by the browser

* **Issue**: Email not sending  
  **Solution**: Verify EmailJS Service ID, Template ID, and Public Key

* **Issue**: Project filter not working  
  **Solution**: Ensure JavaScript is loaded and no console errors exist

## Contributing

### Contribution Guidelines

This project is currently a personal academic portfolio and not open for external contributions.

### Development Setup

* Modify HTML for content updates
* Update CSS variables for design changes
* Extend JavaScript for new UI features

## References

* Zybook course material  
* W3Schools  
* YouTube tutorials  

## Conclusion

This portfolio website demonstrates a structured front-end architecture, dynamic content handling, user interaction, and integration with external services (EmailJS). It showcases modern JavaScript techniques, responsive design, and user-centered feedback mechanisms.

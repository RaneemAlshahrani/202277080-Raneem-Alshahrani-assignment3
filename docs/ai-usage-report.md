# AI Usage Report

## Overview
This project is a front-end personal portfolio website developed to showcase academic background, technical skills, and projects. It runs entirely on the client side using HTML, CSS, and JavaScript, with EmailJS for contact handling and the GitHub API for dynamic data.

The system is lightweight, responsive, and requires no backend or build tools.

---

## AI Tools Used

**ChatGPT**:
- Helped explain JavaScript concepts and API usage  
- Assisted with debugging logic and UI issues  

**Claude AI**:
- Performed code review (CSS & JS)  
- Suggested performance optimisations  
- Helped debug GitHub API display issue  
- Assisted in structuring documentation  

---

## Effective Use of AI

### 1. Code Review
AI identified redundant CSS rules and inefficient JavaScript logic, improving code quality and readability.

### 2. Performance Optimisation
Suggested lazy loading images, using `defer`, and improving font loading to reduce load time.

### 3. Debugging
Helped diagnose a visibility issue in the GitHub section caused by animation + async rendering conflict.

### 4. API Integration
Clarified GitHub API usage and improved data handling (sorting, filtering, error handling).

### 5. Security Improvement
Introduced sanitisation of API data to prevent XSS when using `innerHTML`.

---

## Learning Outcomes

### HTML Concepts Learned:
- Semantic structure and accessibility (ARIA)
- Responsive layout design

### CSS Concepts Learned:
- CSS variables and theming  
- Avoiding redundant rules  
- Managing specificity and `!important`  

### JavaScript Concepts Learned:
- API fetching and async handling  
- localStorage vs sessionStorage  
- DOM optimisation (caching elements)  
- IntersectionObserver behavior  

---

## Benefits & Challenges

### Benefits
- Faster debugging and problem-solving  
- Improved code quality and performance  
- Better understanding of real-world issues  

### Challenge 1:
GitHub repositories were not visible due to a conflict between animations and dynamically loaded content.

### Challenge 2:
CSS conflicts caused by misuse of `!important`, leading to unexpected layout behavior.

### Challenge 3:
Project filtering and sorting logic interfered with each other, requiring better state management to ensure correct results.

### Challenge 4:
Form validation required handling multiple edge cases (empty fields, invalid email, async submission feedback).

---

## Responsible Use & Modifications

- All AI outputs were reviewed and tested  
- Code was modified to fit project requirements  
- No full features were copied directly  
- Understanding was prioritised over copying  

---

## Innovation

- Integrated live GitHub data dynamically  
- Combined filtering + sorting system  
- Added visitor personalization and session timer  
- Applied performance and security improvements beyond requirements  

---

## Conclusion

AI was used as a support tool for debugging, optimisation, and learning. It improved development efficiency without replacing understanding or originality. The final project reflects independent implementation enhanced by AI-assisted refinement.

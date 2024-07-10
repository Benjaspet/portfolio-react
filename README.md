<p align="center">
  <h2 style="text-align: center; text-decoration: underline">
      Ben Petrillo – Portfolio
  </h2>
</p>

<p align="center">
    The official repository for my <a href="https://benpetrillo.dev">software engineering portfolio</a>.
</p>

<p style="text-align: center">
    <img src="https://img.shields.io/badge/Made%20With%20React.js-blue?style=for-the-badge&logo=react&logoColor=white" alt=""/>
    <img src="https://img.shields.io/badge/Supports%20-Node.js%20v22+-gray.svg?colorA=61c265&colorB=4CAF50&style=for-the-badge&logo=java&logoColor=white" alt=""/>
</p>

---

I'm Ben Petrillo, a current third-year student at Northeastern University pursuing a Bachelor 
of Science in Computer Science with a concentration in Software. I am looking to take on a career
in frontend, backend, or full-stack development.

---

### Portfolio Features
- A clean, elegant, responsive design that is bootstrap-esque (but completely custom).
- Dynamic meta tag rendering. Please note that it is impossible to render meta tags dynamically for
  web scrapers (i.e. for link previews) because the web app is built with React, and said
  web scrapers do not execute JavaScript.
- Fully configurable `config.json` file for dynamic rendering of work experience, projects, and 
  skills. Please note that for project-based skills, the images are rendered based on the name
  of the skill itself. For example, if the skill is "React", the image rendered will be `react.png`.
  The only images currently supported exist within `public/icons`.

### Work-in-Progress Features
- A comments section where users can leave comments on my portfolio. The current plan is to have
  this feature be fully integrated with Google OAuth2.0 for user authentication, and Sqlite3 for
  secure and encrypted storage of comments and user data.
  - Use HTTP-only, secure, site-specific cookies for easy user authentication.
- A blog section where I can write about anything I'd like (most likely tech-related).

### License

Copyright © 2024 Ben Petrillo. All rights reserved.

This project is licensed under the [MIT License](https://www.mit.edu/~amini/LICENSE.md).
All portions of this software are available for public use, provided that credit is given to the original author(s).
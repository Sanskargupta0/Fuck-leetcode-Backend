# Project: FuckLeetCode - AI LeetCode Auto-Solver

## High-Level Goal
This project is an AI-powered bot that automatically solves LeetCode problems for users. The system consists of a central backend API, a user-facing frontend, and a user-run cron job via GitHub Actions.

## Core Components
1.  **Backend API (This Project):** A Node.js/Express application that manages users, problems, solutions, and coordinates tasks for the cron jobs.
2.  **User-Cloned Repo (Cron Job):** A separate repository that users clone. It contains a GitHub Actions workflow that runs daily. This job calls our backend to get a task and submits the solution to LeetCode using the user's own credentials.
3.  **Frontend:** A web app where users sign up, configure their settings, and view their progress.

## Database Schemas (Mongoose)

-   **User:**
    -   `email`: String, required, unique
    -   `username`: String
    -   `config`: Object with `dailyLimit` and `languagePreference`.
    -   `solvedProblems`: An array of ObjectIds referencing the `Problem` model.
-   **Problem:**
    -   `questionId`: Number, required, unique
    -   `title`: String
    -   `titleSlug`: String, unique
    -   `difficulty`: String ('Easy', 'Medium', 'Hard')
    -   `isPremium`: Boolean
-   **Solution:**
    -   `problem`: ObjectId referencing the `Problem` model.
    -   `language`: String (e.g., 'javascript', 'python')
    -   `code`: The full solution code.
    -   `source`: String ('gemini' or 'manual')

## Key API Endpoints

-   `GET /api/tasks/:userId/next`: **Primary endpoint for the cron job.** It finds an unsolved, non-premium problem for the user, gets a corresponding solution (from DB or by generating one with Gemini), and returns them to the cron job.
-   `POST /api/tasks/report`: **Cron job reports back.** After a submission, the cron job calls this endpoint to report success or failure. On success, the backend updates the user's `solvedProblems` list.
-   `/api/users`: Standard CRUD for user profiles and configurations.
-   `/api/admin`: Endpoints for administrative tasks, like syncing the problems list from LeetCode.
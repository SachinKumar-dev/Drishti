# Firebase Studio

This project is a NextJS starter within Firebase Studio. It provides a basic structure for building web applications with NextJS and Firebase.

## Getting Started

To get started with this project, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone <https://github.com/SachinKumar-dev/Drishti.git>
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up Firebase:**

    *   Make sure you have the Firebase CLI installed. If not, install it globally:

        ```bash
        npm install -g firebase-tools
        ```

    *   Log in to your Firebase account:

        ```bash
        firebase login
        ```

    *   Initialize Firebase in your project. Follow the prompts to select your project and set up the desired Firebase services (e.g., Authentication, Firestore, Hosting, Functions):

        ```bash
        firebase init
        ```

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

The main entry point for the NextJS application is `src/app/page.tsx`. The project includes various components and utility files within the `src` directory.

## Available Scripts

*   `npm run dev`: Runs the project in development mode.
*   `npm run build`: Builds the project for production.
*   `npm run start`: Starts the production server.
*   `npm run lint`: Lints the project files.

## Dependencies

The project uses a variety of libraries, including React, NextJS, Firebase, and various UI component libraries. A full list of dependencies can be found in the `package.json` file.

## Learn More

To learn more about NextJS, take a look at the [NextJS Documentation](https://nextjs.org/docs).
To learn more about Firebase, take a look at the [Firebase Documentation](https://firebase.google.com/docs).

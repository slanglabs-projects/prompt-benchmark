# Project Setup Instructions

Follow these steps to set up and run the project:

1. Clone the repository:

   ```
   git clone git@github.com:slanglabs-projects/prompt-benchmark.git
   ```
2. Install Node.js (if not already installed):

   ```
   brew install node
   ```
3. Verify Node.js and npm versions:

   ```
   node -v
   npm -v
   ```

   You should see version 22.5.1 for Node.js and 10.8.2 for npm.
4. Navigate to the project directory:

   ```
   cd prompt-benchmark
   ```
5. Install project dependencies(node modules) in both Root Directory and React Directory

   ```
   npm install

   cd client/leaderboard-app

   npm install
   ```
6. Install Bootstrap:

   ```
   npm i bootstrap@5.3.3
   ```
7. Navigate to the React project folder:

   ```
   cd client/leaderboard-app
   ```
8. Start the project:

   ```
   npm start
   ```

The project should now be running. Open your browser and navigate to the local server address (typically `http://localhost:3000`) to view the application.

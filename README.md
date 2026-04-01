# Contest Management System

A modern web application for hosting and participating in coding contests. This platform allows users to solve programming problems, submit solutions, and track their progress.

## Features

- **User Authentication**: Basic login system using mobile number
- **Problem Repository**: Browse and solve a variety of coding problems
- **Code Editor**: Built-in editor with syntax highlighting for multiple languages
- **Code Execution**: Run your code against sample test cases
- **Submission System**: Submit solutions and get immediate feedback
- **Submission History**: Track your previous submissions and performance


## Tech Stack

- **Frontend**: React with TypeScript
- **State Management**: React Context API
- **Styling**: Tailwind CSS
- **Icons**: React Icons
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/contest-management-system.git
   cd contest-management-system
   ```

2. Install dependencies
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

3. Start the development server
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── api/            # API configuration and endpoints
├── assets/         # Static assets and default code templates
├── components/     # Reusable UI components
│   ├── CodeEditor/ # Code editor component
│   ├── Sidebar/    # Navigation sidebar
│   └── ...
├── context/        # React context providers
│   ├── AuthContext.tsx    # Authentication state
│   └── ProblemContext.tsx # Problem and submission state
├── pages/          # Application pages
└── App.tsx         # Main application component
```

## Usage

1. **Login**: Log in to access the platform
2. **Browse Problems**: View the list of available coding problems
3. **Solve Problems**: Select a problem to view its details and start coding
4. **Run Code**: Test your solution with sample inputs
5. **Submit Solution**: Submit your code for evaluation
6. **View Submissions**: Check your submission history and results

## Features in Detail

### Problem Solving

- Each problem includes a detailed description, sample inputs, and expected outputs
- Write code in your preferred programming language
- Test your solution with custom inputs before submitting
- Get immediate feedback on your submission

### Submission Tracking

- View all your previous submissions
- See detailed results for each submission
- Track your progress with solved problem indicators


## Roadmap

### Features

- Draggable change of height and width of different containers in contest page.
- Minimization of different components.
- Code editor can be expanded to full screen.
- Add button to format the code.
- Restoring the state of code on changing the question number.
- Add undo and redo on Code Editor.
- Show number of test cases passed on submit.
- View the code of previous solutions.# code-judge-frontend

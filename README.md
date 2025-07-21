# CodeMates 🌐

CodeMates is a social networking platform designed to help developers connect, collaborate, and showcase their projects. It provides a space for users to share their work, find potential collaborators, and stay up-to-date with the latest trends in the tech industry. The platform offers features such as user feeds, profiles, connection requests, and real-time chat, all built with modern web technologies.

## 🚀 Key Features

- **User Authentication:** Secure user authentication and authorization using Clerk. 🔐
- **Real-time Chat:** Instant messaging with other developers using WebSockets. 💬
- **Project Showcasing:** Display your projects with descriptions, tech stacks, and images. 🖼️
- **User Feed:** Stay updated with posts and activities from other developers. 

- **Connection Management:** Send and receive connection requests to build your network. 🤝
- **Profile Management:** Create and customize your profile with relevant information. 👤
- **Redux State Management:** Centralized state management for efficient data handling. 🗄️
- **Responsive Design:** A user interface that adapts to different screen sizes. 📱💻

## 🛠️ Tech Stack

- **Frontend:**
    - React: JavaScript library for building user interfaces.
    - React Router DOM: For handling client-side routing.
    - Redux Toolkit: For state management.
    - @clerk/clerk-react: For user authentication.
    - @heroui/react: A UI library for styling and components.
    - framer-motion: For animations.
    - socket.io-client: For real-time communication using WebSockets.
    - axios: For making HTTP requests.
    - react-icons: For including icons.
- **Backend:** 
    - Node.js
    - Express.js: Common framework for Node.js APIs.
    - Socket.IO: For real-time communication.
- **Database:**
    - MongoDB: A common choice for Node.js applications.


## 📦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Clerk account for authentication.

### Installation

1.  Clone the repository:

```bash
git clone <repository-url>
cd <repository-directory>
```

2.  Install dependencies:

```bash
npm install # or yarn install
```

3.  Configure environment variables:

    - Create a `.env` file in the root directory.
    - Add your Clerk publishable key:

```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

    - Add your backend base URL:

```
VITE_BASE_URL=http://localhost:8000 # or your deployed backend URL
```

### Running Locally

1.  Start the development server:

```bash
npm run dev # or yarn dev
```

2.  Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite).

## 💻 Project Structure

```
📂 Connectify
├── 📂 src
│   ├── 📄 App.jsx
│   ├── 📄 main.jsx
│   ├── 📄 index.css
│   ├── 📂 components
│   │   ├── 📄 body.jsx
│   │   ├── 📄 Feed.jsx
│   │   ├── 📄 Profile.jsx
│   │   ├── 📄 Connections.jsx
│   │   ├── 📄 Requests.jsx
│   │   ├── 📄 Chat.jsx
│   │   ├── 📄 LandingPage.jsx
│   │   ├── 📄 Project.jsx
│   │   ├── 📄 EditProfile.jsx (Assumed)
│   │   ├── 📄 FeedUserCard.jsx (Assumed)
│   │   ├── 📄 NavBar.jsx (Assumed)
│   │   ├── 📄 Footer.jsx (Assumed)
│   │   └── 📂 icons
│   │       ├── 📄 SendIcon.jsx
│   │       └── 📄 PlusIcon.jsx
│   ├── 📂 utils
│   │   ├── 📄 appStore.js
│   │   ├── 📄 userSlice.js
│   │   ├── 📄 feedSlice.js
│   │   ├── 📄 connectionSlice.js
│   │   ├── 📄 requestsSlice.js
│   │   ├── 📄 socket.js
│   │   ├── 📄 constants.js
│   │   ├── 📄 techOptions.js
│   │   └── 📄 api-test.js (Assumed)
│   └── 📄 assets (Assumed)
│       └── 📄 images (Assumed)
├── 📄 .env
├── 📄 package.json
├── 📄 vite.config.js
├── 📄 README.md
└── 📄 .gitignore
```

## 📸 Screenshots

<img width="959" height="448" alt="image" src="https://github.com/user-attachments/assets/0808bdcd-6b04-4437-b748-4435ee11346b" />

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive messages.
4.  Push your changes to your fork.
5.  Submit a pull request.

## 📝 License

This project is licensed under the [MIT License](LICENSE).

## 📬 Contact

For questions or feedback, please contact: Vanshika Agarwal - vanshikaagarwal781@gmail.com

## 💖 Thanks

Thank you for checking out Codemate! We hope you find it useful for connecting with other developers and showcasing your projects.

This is written by [readme.ai](https://readme-generator-phi.vercel.app/)

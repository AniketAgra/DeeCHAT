# 🧠 DeepChat – AI Chat Application

DeepChat is a ChatGPT-like web application where users can chat with an AI assistant in real time.  
It supports **login/signup**, **real-time streaming responses**, **short-term memory**, and **chat history management** — all built with **Express.js, EJS, MongoDB, Socket.IO, and Gemini Flash 2.0 API**.

---

## 🚀 Features
- **User Authentication** – Secure login & signup using MongoDB.
- **AI Chat Interface** – Chat with an AI assistant powered by Gemini Flash 2.0.
- **Real-Time Streaming** – Live responses using Socket.IO, similar to ChatGPT’s typing effect.
- **Short-Term Memory** – Restores context from recent chat messages for better AI responses.
- **Chat History & Sidebar** – Create new chats, switch between conversations, and view past sessions.
- **Clean UI** – Built with EJS and CSS for a smooth, ChatGPT-like experience.

---

## 🛠️ Tech Stack
- **Frontend:** EJS, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Real-Time Communication:** Socket.IO
- **AI Integration:** Google Gemini Flash 2.0 API

---

## 📸 Screenshots
> 

---

## 📂 Project Structure
```bash
DeepChat/
├── public/              # Static assets (CSS, JS)
├── views/               # EJS templates
├── routes/              # Express routes
├── models/              # MongoDB models (User, Chat)
├── controllers/         # Controller logic
├── sockets/             # Socket.IO handlers
├── app.js               # Main Express server file
├── package.json
└── README.md

⚙️ Installation & Setup

Clone the repository

git clone https://github.com/AniketAgra/Deechat
cd deepchat


Install dependencies

npm install


Configure environment variables
Create a .env file in the root folder and add:

MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
SESSION_SECRET=your_session_secret


Run the development server

npm run dev


Open http://localhost:3000
 in your browser 🎉

🧠 How It Works

Users sign up or log in (stored securely in MongoDB).

Frontend sends chat messages to backend using Socket.IO.

Backend calls Gemini Flash 2.0 API and streams the response back.

Chat data is stored in MongoDB for history and context restoration.

🤝 Contributing

Contributions are welcome! Feel free to fork the repo, submit issues, and create pull requests.

📜 License

This project is licensed under the MIT License.

🙌 Acknowledgements

Gemini API

Socket.IO

Express.js

MongoDB

Made with ❤️ by Aniket Agrawal


---

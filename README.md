# Annoy Group Chat Application

A real-time anonymous group chat application with modern UI and privacy features.

## Features

- **Real-time Messaging**: Uses WebSocket for instant communication.
- **Anonymous User Profiles**: Generates random avatars for users.
- **Spam Protection**: Validates messages to prevent harmful content.
- **Modern UI**: Responsive design with left/right message bubbles.
- **Active Users Display**: Shows the number of online users.
- **Message Persistence**: Stores chat history in MongoDB.
- **Message Limits**: 255-character limit per message.
- **Timestamps**: All messages include a timestamp.
- **Privacy Focused**: No personal data is stored.

## Tech Stack

### Frontend
- React
- TailwindCSS
- Socket.io-client

### Backend
- Node.js
- Express
- Socket.io

### Database
- MongoDB

## Installation & Setup

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- npm or yarn

### Getting Started

1. **Clone the Repository**
```bash
git clone https://github.com/mahmud-r-farhan/annoy-group-chat.git
cd annoy-group-chat
```

2. **Install Dependencies**
```bash
cd server && npm install
cd ../client && npm install
```

3. **Create Environment Variables**
Create a `.env` file inside the `server` directory and add the following:
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

4. **Run the Application**
```bash
# Start the server
cd server && npm start

# Start the client
cd client && npm run dev
```

5. **Access the App**
Open your browser and go to `http://localhost:5173/` (or the appropriate client port).

## Usage Guidelines

- Be respectful to other users.
- No spam, hate speech, or harmful content.
- Do not share personal information.
- Messages are limited to 255 characters.
- Inappropriate content will be filtered.

## Privacy Policy

- Users remain anonymous.
- No personal data is stored.
- Chat messages are stored for 30 days.
- No tracking or analytics.
- Messages are **not encrypted**.

## Folder Structure
```
annoy-group-chat/
│── client/             # Frontend code (React)
│── server/             # Backend code (Node.js, Express, Socket.io)
│── README.md           # Documentation
│── .gitignore          # Git ignore file

```

## Contributing
Pull requests are welcome. If you'd like to make major changes, please open an issue first.

### Contribution Steps
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to your branch (`git push origin feature-branch`).
5. Open a pull request.

## License

This project is licensed under the [MIT License](LICENSE). Feel free to modify and distribute it as needed.

## Contact
For any issues or suggestions, feel free to open an issue on GitHub or contact me at `dev@devplus.fun`.

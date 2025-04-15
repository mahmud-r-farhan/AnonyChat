# Annoy Group Chat Application

A real-time anonymous group chat application with a modern, responsive UI, privacy-focused design, and dynamic background customization.

## Features

- **Real-time Messaging**: Powered by Socket.io for instant message delivery and updates.
- **Anonymous User Profiles**: Automatically generates random usernames and avatars using DiceBear API, ensuring user anonymity.
- **Dynamic Backgrounds**: Offers customizable backgrounds with a mix of curated static images and dynamic fetching from the Unsplash API for virtually unlimited options.
- **Collapsible Active Users Sidebar**: Displays online users with avatars and status indicators, toggleable on both mobile and desktop for a streamlined experience.
- **Typing Indicators**: Shows when other users are typing, enhancing real-time interaction.
- **Message Persistence**: Stores chat history in MongoDB with date-based grouping (e.g., "Today," "Yesterday") for easy navigation.
- **Spam Protection**: Enforces a 255-character limit per message and validates content to prevent spam or harmful messages.
- **Modern UI**: Responsive design with left/right message bubbles, TailwindCSS styling, and smooth animations via Framer Motion.
- **Emoji Support**: Integrated emoji picker for expressive messaging.
- **Infinite Scroll**: Loads older messages on demand with a smooth scrolling experience.
- **Community Guidelines**: Displays rules on first use to promote respectful interactions.
- **Timestamps**: Messages include formatted timestamps (e.g., "3:45 PM") for clarity.
- **Privacy Focused**: No personal data collection, anonymous user IDs, and messages stored for only 30 days.
- **Error Handling**: Displays temporary error messages for connection issues or invalid inputs without disrupting the chat.
- **Notification Sounds**: Plays a subtle sound for incoming messages from other users.
- **Background Cycling**: Allows users to cycle through backgrounds with a single click, enhancing personalization.

## Tech Stack

### Frontend
- **React**: Component-based UI with hooks for state management.
- **Vite**: Fast build tool for development and production.
- **TailwindCSS**: Utility-first CSS for responsive styling.
- **Socket.io-client**: Real-time communication with the server.
- **Framer Motion**: Smooth animations for UI elements (e.g., sidebar, messages).
- **Emoji Picker React**: Emoji selection for messages.
- **date-fns**: Date formatting for message timestamps.

### Backend
- **Node.js**: Server-side runtime environment.
- **Express**: Web framework for API endpoints.
- **Socket.io**: Real-time WebSocket communication.
- **MongoDB**: NoSQL database for message persistence.

### Database
- **MongoDB**: Stores chat messages and user sessions with a 30-day retention policy.

## Installation & Setup

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- npm or yarn

### Getting Started

1. **Clone the Repository**
   
   ```bash
   
	 git clone https://github.com/mahmud-r-farhan/AnonyChat
     cd AnonyChat ```



2.  **Install Dependencies**
   
    
    ```bash
    cd server && npm install
    cd ../client && npm install
    ```
    
3.  Create Environment Variables
    
    -   In the server directory, create a .env file:
        
        env
        
        ```text
        MONGO_URI=your_mongodb_connection_string
        PORT=5007
        ```
        
    -   In the client directory, create a .env file:
        
        env
        
        ```text
        VITE_API_URL=http://localhost:5007
        ```
        
            
        -   Use MongoDB Atlas or a local MongoDB instance for MONGO_URI.
            
4.  Run the Application
    
    bash
    
    ```bash
    # Start the server
    cd server && npm start
    
    # Start the client (in a new terminal)
    cd client && npm run dev
    ```
    
5.  Access the App Open your browser and go to http://localhost:5173/ (or the port shown in the client terminal).


## **License**

This project is licensed under the MIT License (LICENSE). Feel free to use, modify, and distribute it as needed.

## Contact

For issues, suggestions, or questions, open an issue on GitHub or contact me at dev@devplus.fun.

----------
# HealthChat

HealthChat is an innovative Next.js-based application designed to revolutionize healthcare communication. By harnessing the power of artificial intelligence, it offers a sophisticated and intuitive conversational experience tailored for health-related inquiries and support. The application seamlessly integrates Google's cutting-edge Gemini API for advanced natural language processing, ensuring accurate and context-aware responses. With robust data management powered by MongoDB, HealthChat provides a secure and efficient platform for storing and retrieving user information and conversation history. This combination of technologies enables HealthChat to deliver personalized, AI-driven health guidance and information in real-time, making it an invaluable tool for both patients and healthcare professionals.

## Features

- User authentication with email/password and Google OAuth
- Real-time chat interface
- AI-powered responses using Gemini API
- Secure data storage with MongoDB
- Responsive design for various devices

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework for server-side rendering and routing
- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js
- [MongoDB](https://www.mongodb.com/) - NoSQL database for data storage
- [Gemini API](https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/gemini) - Google's language model for AI-powered responses
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in the required values for MongoDB, Gemini API, NextAuth, and Google OAuth
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `components/` - React components used throughout the application
- `app/` - Next.js pages and API routes
- `models/` - Mongoose models for MongoDB
- `utils/` - Utility functions and database connection

## Deployment

This application can be easily deployed on [Vercel](https://vercel.com/), the platform created by the makers of Next.js. Follow their deployment documentation for detailed instructions.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).


## About the Creator

This project was created by Mohit Goyal,Connect with him on [LinkedIn](https://www.linkedin.com/in/0xmohit/).



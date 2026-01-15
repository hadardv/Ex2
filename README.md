# YUV.AI Trends MVP
https://ex2-navy.vercel.app/
A web application that displays trending AI and Machine Learning repositories from GitHub with AI-powered summarization capabilities.

## Project Description

YUV.AI Trends is an MVP (Minimum Viable Product) that helps developers discover the most active and popular AI/Machine Learning projects. The application fetches repositories from GitHub that have had recent activity in the past week, sorts them by popularity (star count), and allows users to generate concise AI summaries of project descriptions using Groq's LLM API.

## Features

- **Trending Repository Display**: Shows the top 20 AI repositories with recent activity
- **Repository Information**: Displays project name, description, star count, programming language, and GitHub link
- **AI Summarization**: Generate 3-line summaries of repository descriptions using Groq's free API
- **Settings Management**: Store and manage Groq API key locally in the browser
- **Responsive Design**: Adapts to desktop (3 columns), tablet (2 columns), and mobile (1 column) layouts
- **Apple-Inspired UI**: Clean, minimal design with soft shadows and smooth animations

## Tech Stack

### Frontend Framework

- **Next.js 15** (App Router): React-based framework for server-side rendering and API routes
- **React 18**: Component-based UI library with hooks for state management
- **TypeScript**: Type-safe JavaScript for better code quality and developer experience

### Styling

- **CSS Modules**: Scoped CSS files to prevent style conflicts and maintain component encapsulation
- **Custom CSS**: No external UI libraries (no Tailwind, Bootstrap, or Material UI)
- **Apple-Inspired Design**: Clean aesthetic with system fonts, rounded corners, and soft shadows

### Data Storage

- **localStorage**: Client-side storage for persisting the Groq API key across sessions
- **In-Memory Caching**: Server-side cache for GitHub API responses (10-minute duration)

### APIs

- **GitHub Search API**: Fetches trending repositories with AI-related keywords
- **Groq API**: Generates AI summaries using the llama-3.3-70b-versatile model

## How to Run

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- A free Groq API key (obtainable at console.groq.com)

### Installation Steps

1. Clone the repository:

```bash
git clone <repository-url>
cd ex2-web
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open your browser and navigate to:

```
http://localhost:3000
```

5. Configure your API key:
   - Click the Settings button (gear icon) in the top-right corner
   - Enter your Groq API key
   - Click Save

### Using the Application

1. The homepage automatically loads trending AI repositories from the past week
2. Browse through the repository cards to see project details
3. Click the "Summarize" button on any card to generate an AI summary
4. Click "View on GitHub" to visit the repository

## Project Structure

```
ex2-web/
├── app/
│   ├── api/
│   │   ├── summarize/
│   │   │   └── route.ts          # API endpoint for AI summarization
│   │   └── trends/
│   │       └── route.ts          # API endpoint for GitHub trends
│   ├── globals.css               # Global styles and CSS reset
│   ├── layout.tsx                # Root layout component
│   ├── page.tsx                  # Homepage component
│   └── page.module.css           # Homepage styles
├── components/
│   ├── NewsCard/
│   │   ├── NewsCard.tsx          # Repository card component
│   │   └── NewsCard.module.css   # Card styles
│   └── SettingsModal/
│       ├── SettingsModal.tsx     # Settings modal component
│       └── SettingsModal.module.css  # Modal styles
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
└── next.config.js                # Next.js configuration
```

## API Endpoints

### GET /api/trends

Fetches trending AI repositories from GitHub.

**Response:**

```json
{
  "data": [
    {
      "id": 614765452,
      "name": "AutoGPT",
      "fullName": "Significant-Gravitas/AutoGPT",
      "description": "Repository description...",
      "stars": 181109,
      "forks": 46260,
      "language": "Python",
      "url": "https://github.com/Significant-Gravitas/AutoGPT",
      "createdAt": "2023-03-16T09:21:07Z",
      "owner": {
        "login": "Significant-Gravitas",
        "avatar": "https://avatars.githubusercontent.com/u/..."
      }
    }
  ],
  "cached": false,
  "fetchedAt": "2026-01-15T12:00:00.000Z"
}
```

### POST /api/summarize

Generates an AI summary of repository description.

**Request:**

```json
{
  "text": "Repository description to summarize",
  "apiKey": "your-groq-api-key"
}
```

**Response:**

```json
{
  "summary": "Three-line summary of the repository..."
}
```

## Design Decisions

### Why CSS Modules?

CSS Modules provide component-scoped styling without the overhead of CSS-in-JS libraries or the utility-first approach of Tailwind. This keeps the codebase simple and maintainable for educational purposes.

### Why localStorage?

The API key is stored client-side to avoid the complexity of backend authentication for this MVP. This approach is suitable for educational projects where each user brings their own API key.

### Why Groq?

Groq provides free, fast LLM API access with OpenAI-compatible endpoints, making it ideal for student projects and demonstrations.

### Why In-Memory Caching?

GitHub's API has rate limits (60 requests/hour for unauthenticated users). Caching responses for 10 minutes reduces API calls while keeping data relatively fresh.

## License

This project is for educational purposes as part of a web development assignment.

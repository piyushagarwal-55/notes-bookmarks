# Frontend for Notebook Application

This is the frontend for the Notebook application built with Next.js, React, and TypeScript.

## Features

- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Authentication**: Secure login and registration
- **Notes Management**: Create, edit, and organize notes with rich text support
- **Bookmarks Management**: Save and categorize web bookmarks
- **Search & Filter**: Powerful search and filtering capabilities
- **Favorites**: Mark important notes and bookmarks
- **Real-time Updates**: Instant UI updates with optimistic updates
- **Mobile Responsive**: Works perfectly on all devices

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Backend API server running (see express-backend folder)

### Installation

1. **Navigate to the frontend folder:**
   ```bash
   cd frontend/notes\ web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Copy `.env.example` to `.env.local` and update:
   ```bash
   cp .env.example .env.local
   ```

4. **Update the .env.local file:**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NODE_ENV=development
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to Vercel

## Project Structure

```
frontend/notes web/
├── app/                     # Next.js App Router
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   ├── login/              # Login page
│   ├── signup/             # Signup page
│   ├── notes/              # Notes dashboard
│   └── bookmarks/          # Bookmarks dashboard
├── lib/                    # Utility functions
│   ├── api.ts              # API configuration
│   └── config.ts           # App configuration
├── types/                  # TypeScript type definitions
│   └── env.d.ts            # Environment types
├── .env.local              # Environment variables
├── .env.example            # Environment template
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS config
├── tsconfig.json           # TypeScript config
└── next.config.js          # Next.js config
```

## Deployment

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub**

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set the root directory to `frontend/notes web`

3. **Add environment variables in Vercel dashboard:**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
   NODE_ENV=production
   ```

4. **Deploy!** Vercel will automatically build and deploy your frontend.

### Deploy to Netlify

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy the `out` folder to Netlify**

3. **Set environment variables in Netlify dashboard:**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
   NODE_ENV=production
   ```

### Manual Deployment

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Start production server:**
   ```bash
   npm start
   ```

## Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:5000/api` |
| `NODE_ENV` | Environment mode | `development` or `production` |

### API Configuration

The frontend communicates with the backend through the API configuration in `lib/config.ts`. Make sure the `NEXT_PUBLIC_API_URL` environment variable points to your running backend server.

## Development Notes

- The frontend uses Next.js App Router for routing
- Styling is done with Tailwind CSS
- State management uses React hooks
- API calls are made with Axios
- TypeScript is used for type safety

## Features Overview

### Authentication
- Secure login/logout functionality
- Registration with email validation
- JWT token management
- Protected routes

### Notes
- Rich text editing
- Tag organization
- Search functionality
- Favorite marking
- Create, edit, delete operations

### Bookmarks
- URL bookmark saving
- Automatic title fetching
- Tag categorization
- Search and filter
- Favorite marking

### UI/UX
- Responsive design for all screen sizes
- Dark/light mode support
- Smooth animations with Framer Motion
- Toast notifications for user feedback
- Modern, clean interface

## Troubleshooting

### Common Issues

1. **API Connection Issues:**
   - Ensure the backend server is running
   - Check the `NEXT_PUBLIC_API_URL` environment variable
   - Verify CORS settings in the backend

2. **Build Errors:**
   - Run `npm install` to ensure all dependencies are installed
   - Check for TypeScript errors
   - Ensure environment variables are set

3. **Styling Issues:**
   - Make sure Tailwind CSS is properly configured
   - Check for conflicting CSS rules
   - Verify PostCSS configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

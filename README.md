# 📓 Notebook – Frontend Application

A modern Next.js frontend application for managing personal notes and web bookmarks. This is the frontend component that connects to a separate Express.js backend API.

## ✨ Features

🔐 **Secure Authentication** – JWT-based login system  
🎨 **Beautiful Interface** – Designed with Tailwind CSS  
📱 **Fully Responsive** – Works perfectly across devices  
📝 **Rich Note Editor** – Markdown support with live preview  
🔖 **Bookmark Manager** – Save and organize favorite links  
⭐ **Favorites System** – Mark important content  
🏷️ **Tag Management** – Organize with custom tags  
🔍 **Advanced Search** – Smart content filtering  

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** – React framework with App Router
- **Tailwind CSS** – Modern CSS framework
- **TypeScript** – Type-safe development
- **Framer Motion** – Smooth animations
- **React Icons** – Icon library

### Backend (Separate Repository)
- **Express.js API** – RESTful backend services
- **MongoDB** – Database storage
- **JWT Authentication** – Secure user sessions

### Authentication
- **JWT (JSON Web Tokens)** – Stateless user authentication
- **bcryptjs** – Secure password hashing
- **HTTP-only Cookies** – Protects against XSS attacks

## 🚀 Quick Start

### Prerequisites
Make sure your system has:
- Node.js (v18+)
- MongoDB (local or cloud)
- npm or yarn installed

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd notebook
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
FRONTEND_URL=http://localhost:3000
```

4. **Start the development servers**

Open two terminals:

**Terminal 1 – Backend:**
```bash
npm run server:dev
```

**Terminal 2 – Frontend:**
```bash
npm run dev
```

5. **Visit the application**
- Frontend: http://localhost:3000
- API Backend: http://localhost:5000

## 📁 Project Structure

```
notebook/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── login/             # Login UI
│   ├── signup/            # Signup UI
│   ├── notes/             # Notes dashboard
│   └── bookmarks/         # Bookmarks dashboard
├── api/                   # Serverless API (for production)
│   ├── config/            # DB and app config
│   ├── middleware/        # Custom middleware
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   └── index.js           # API entry point
├── backend/               # Express API server (for development)
│   ├── config/            # DB and app config
│   ├── middleware/        # Custom middleware
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   └── server.js          # Express entry point
├── lib/                   # Utility functions
│   └── api.ts             # API configuration
├── package.json           # Dependencies
├── vercel.json            # Vercel deployment config
├── tailwind.config.js     # Tailwind setup
└── next.config.js         # Next.js config
```

## 🔗 API Routes

### Authentication
- `POST /api/auth/register` – Register new user
- `POST /api/auth/login` – Login existing user
- `GET /api/auth/me` – Get current logged-in user
- `POST /api/auth/logout` – Logout user

### Notes
- `GET /api/notes` – Get all notes
- `POST /api/notes` – Create new note
- `PUT /api/notes/:id` – Update note
- `DELETE /api/notes/:id` – Delete note
- `PUT /api/notes/:id/favorite` – Toggle favorite status

### Bookmarks
- `GET /api/bookmarks` – Get all bookmarks
- `POST /api/bookmarks` – Create new bookmark
- `PUT /api/bookmarks/:id` – Update bookmark
- `DELETE /api/bookmarks/:id` – Delete bookmark
- `PUT /api/bookmarks/:id/favorite` – Toggle favorite status

### System
- `GET /api/health` – Check server status

## 🚀 Production Deployment on Vercel

### Step 1: Prepare for Deployment

The project is already configured for Vercel deployment with:
- ✅ `vercel.json` configuration file
- ✅ Serverless API functions in `/api` directory
- ✅ Environment-aware API calls
- ✅ Production-ready build settings

### Step 2: Set up MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Get your connection string
4. Whitelist all IPs (0.0.0.0/0) for Vercel

### Step 3: Deploy to Vercel

#### Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy the project**
```bash
vercel
```

4. **Follow the prompts:**
   - Set up and deploy? **Y**
   - Which scope? Choose your account
   - Link to existing project? **N**
   - Project name: **notebook** (or your preferred name)
   - In which directory is your code located? **./** (current directory)

5. **Set environment variables in Vercel dashboard:**
   - Go to your project dashboard on Vercel
   - Navigate to Settings → Environment Variables
   - Add the following variables:
     ```
     MONGODB_URI=your_mongodb_atlas_connection_string
     JWT_SECRET=your_secure_random_string
     NODE_ENV=production
     ```

6. **Redeploy after setting environment variables**
```bash
vercel --prod
```

#### Method 2: GitHub Integration

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/notebook.git
git push -u origin main
```

2. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables:
     ```
     MONGODB_URI=your_mongodb_atlas_connection_string
     JWT_SECRET=your_secure_random_string
     NODE_ENV=production
     ```

3. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

### Step 4: Configure Domain (Optional)

1. In your Vercel project dashboard
2. Go to Settings → Domains
3. Add your custom domain
4. Follow DNS configuration instructions

### Step 5: Verify Deployment

1. **Test the live application**
   - Visit your Vercel URL
   - Test user registration and login
   - Create notes and bookmarks
   - Verify all features work correctly

2. **Check API health**
   - Visit `https://your-app.vercel.app/api/health`
   - Should return a success response

### Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/notebook` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-super-secret-jwt-key-here` |
| `NODE_ENV` | Environment mode | `production` |

### Troubleshooting

**Common Issues:**

1. **API Routes not working**
   - Ensure `vercel.json` is properly configured
   - Check that all API files are in the `/api` directory

2. **Database connection failed**
   - Verify MongoDB Atlas connection string
   - Ensure IP whitelist includes 0.0.0.0/0
   - Check environment variables are set correctly

3. **Build errors**
   - Run `npm run build` locally to test
   - Check for TypeScript errors
   - Ensure all dependencies are listed in package.json

4. **CORS issues**
   - Update CORS configuration in `/api/index.js`
   - Add your Vercel domain to allowed origins

## 🎯 How to Use

1. Go to your deployed URL or http://localhost:3000
2. Click on "Get Started" to begin
3. Register with your email and password
4. Log in with your credentials
5. You'll be redirected to your Notes Dashboard
6. Use the navigation to switch between Notes and Bookmarks
7. Create, edit, and organize your content with tags and favorites

## 🔒 Security Highlights

- **Password Encryption** – Using bcrypt for safe password storage
- **JWT Tokens** – For secure, stateless authentication
- **HTTP-only Cookies** – Keeps tokens safe from XSS attacks
- **CORS Setup** – Safe and controlled access across origins
- **Environment Variables** – Sensitive data kept secure

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

If you encounter any issues during deployment or usage, please:
1. Check the troubleshooting section above
2. Review Vercel deployment logs
3. Ensure all environment variables are correctly set
4. Verify MongoDB connection

---

**Made with ❤️ using Next.js, Express.js, and MongoDB**

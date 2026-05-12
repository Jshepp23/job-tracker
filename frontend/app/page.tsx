import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-black via-gray-950 to-gray-900 text-white flex items-center justify-center px-6">

      <div className="max-w-3xl text-center">

        <div className="space-y-6">

          <div className="inline-block px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm">
            Full-Stack Job Tracking Platform
          </div>

          <h1 className="text-6xl font-bold leading-tight">
            Organize Your
            <span className="bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {" "}Job Search
            </span>
          </h1>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Track applications, monitor interview progress, manage offers,
            and visualize your job search through a modern full-stack platform
            built with FastAPI, PostgreSQL, Next.js, and JWT authentication.
          </p>

          <div className="flex flex-wrap gap-4 justify-center pt-4">

            <Link
              href="/register"
              className="bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-xl font-medium transition shadow-lg shadow-blue-500/20"
            >
              Get Started
            </Link>

            <Link
              href="/login"
              className="bg-gray-800 hover:bg-gray-700 px-8 py-4 rounded-xl font-medium transition border border-gray-700"
            >
              Login
            </Link>

          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-8 text-sm text-gray-500">
{/* 
            <span className="bg-gray-900 px-3 py-1 rounded-full">
              FastAPI
            </span>

            <span className="bg-gray-900 px-3 py-1 rounded-full">
              PostgreSQL
            </span>

            <span className="bg-gray-900 px-3 py-1 rounded-full">
              Next.js
            </span>

            <span className="bg-gray-900 px-3 py-1 rounded-full">
              JWT Auth
            </span>

            <span className="bg-gray-900 px-3 py-1 rounded-full">
              Full Stack
            </span> */}

          </div>

        </div>

      </div>

    </main>
  );
}
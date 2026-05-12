"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  loginUser
} from "@/lib/api";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  async function handleLogin() {

    setError("");

    try {

      const data = await loginUser(
        email,
        password
      );

      if (data.detail) {
        setError(data.detail);
        return;
      }

      localStorage.setItem(
        "token",
        data.access_token
      );

      router.push("/dashboard");

    } catch (err) {

      setError(
        "Something went wrong."
      );
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-b from-black via-gray-950 to-gray-900 text-white px-6">

      <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl w-full max-w-md space-y-5 shadow-xl">

        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-white transition"
        >
          ← Back Home
        </Link>

        <div>
          <h1 className="text-3xl font-bold">
            Welcome Back
          </h1>

          <p className="text-gray-400 mt-1">
            Login to continue tracking applications.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-500 p-3 rounded-lg font-medium transition"
        >
          Login
        </button>

        <p className="text-sm text-gray-400 text-center">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-blue-400 hover:underline"
          >
            Register
          </Link>
        </p>

      </div>
    </main>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  registerUser
} from "@/lib/api";

export default function RegisterPage() {

  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  async function handleRegister() {

    setError("");

    try {

      const data = await registerUser(
        email,
        password
      );

      if (data.detail) {
        setError(data.detail);
        return;
      }

      router.push("/login");

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
            Create Account
          </h1>

          <p className="text-gray-400 mt-1">
            Start tracking your applications.
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
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500"
        />

        <button
          onClick={handleRegister}
          className="w-full bg-green-600 hover:bg-green-500 p-3 rounded-lg font-medium transition"
        >
          Register
        </button>

        <p className="text-sm text-gray-400 text-center">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-400 hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </main>
  );
}
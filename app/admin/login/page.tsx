'use client'
import { useState } from 'react'
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { Heart } from "lucide-react"

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError('')

    const formData = new FormData(event.currentTarget)
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    if (!username || !password) {
      setError('Both username and password are required.')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      })

      if (!response.ok) {
        throw new Error('Invalid username or password')
      }

      const data = await response.json()

      console.log('Admin login successful:', data)
      // Store admin token in localStorage
      localStorage.setItem('authTokenAdmin', data.token);

      // Redirect admin to the dashboard page
      router.push('/admin/dashboard');
    } catch (error) {
      console.error('Admin login error:', error)
      setError('Invalid username or password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="px-4 lg:px-6 h-14 flex items-center justify-between bg-white shadow-sm">
        <Link className="flex items-center justify-center" href="/">
          <Heart className="h-6 w-6 text-blue-500" />
          <span className="ml-2 text-2xl font-bold text-blue-600">ADMIN PORTAL</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-blue-800">Admin Login</h1>
            <p className="text-blue-600 mt-2">Enter your credentials to access the admin dashboard</p>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-blue-700">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="mt-1 block w-full h-10 rounded-md border-blue-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                placeholder="admin123"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-blue-700">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full h-10 rounded-md border-blue-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </main>
      <footer className="py-6 w-full shrink-0 bg-white border-t border-blue-200">
        <div className="container px-4 md:px-6 mx-auto flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs text-blue-600 text-center sm:text-left">© 2024 ADMIN PORTAL. All rights reserved.</p>
          <nav className="flex gap-4 sm:gap-6 mt-4 sm:mt-0">
            <Link className="text-xs hover:underline underline-offset-4 text-blue-600 hover:text-blue-700" href="/terms">
              Terms of Service
            </Link>
            <Link className="text-xs hover:underline underline-offset-4 text-blue-600 hover:text-blue-700" href="/privacy">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

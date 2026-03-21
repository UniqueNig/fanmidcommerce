import React from 'react'

const Login = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-6 bg-white shadow-md w-80">
        <h1 className="text-xl font-bold mb-4">Admin Login</h1>
        <input className="w-full border p-2 mb-3" placeholder="Email" />
        <input className="w-full border p-2 mb-3" placeholder="Password" type="password" />
        <button className="w-full bg-black text-white p-2">
          Login
        </button>
      </div>
    </div>
  )
}

export default Login
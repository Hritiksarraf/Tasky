'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState,useEffect } from 'react'
import { useRouter } from 'next/navigation';
import jwt from "jsonwebtoken";

function Home() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

   useEffect(() => {
          const token = localStorage.getItem("token");
          if (token) {
              router.push('/dashboard')
          }
      }, [])

  const validatePhoneNumber = (phone) => {
    return /^\d{10}$/.test(phone);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Input validation
    if (!validatePhoneNumber(phone)) {
     alert('plese enter 10 digit number')
      return;
    }

    if (!validatePassword(password)) {
      alert('password must be of more than 7 words')
      return;
    }

    const data = { phone, password };
    setLoading(true);
    
    try {
      let res = await fetch('/api/log-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      let response = await res.json();
      setLoading(false);

      if (response.success) {
        alert('log-in success')
        localStorage.setItem('token',response.token)
        setTimeout(() => {
          router.push('/dashboard'); // Redirect to dashboard after login
        }, 2000);
      } else {
        alert('Login Failed')
      }
      
    } catch (error) {
      setLoading(false);
      alert('Login Failed')
    }
  };

  return (
    <div>
      <section className="bg-gradient-to-b from-white to-blue-200 h-[100vh]">
        <div className="flex flex-col items-center my-auto justify-center h-[80vh] px-6 py-8 mx-auto md:h-screen lg:py-0">
          
          <div className="w-full rounded-lg shadow dark:border dark:border-gray-700 md:mt-0 text-black sm:max-w-md xl:p-0 bg-gradient-to-r from-white to-white">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-black">
                Login to your account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
                <div>
                  <label htmlFor="phone" className="block mb-2 text-sm font-medium text-black dark:text-black">
                    Your Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-blue-100 dark:border-gray-600 dark:placeholder-gray-800 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="7061652485"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-black dark:text-black">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-blue-100 dark:border-gray-600 dark:placeholder-gray-800 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-blue-400 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-black">
                  Don’t have an account yet? <Link href="/sign-up" className="font-medium text-primary-600 hover:underline dark:text-blue-500">Sign up</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

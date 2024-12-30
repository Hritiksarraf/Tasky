'use client'
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CgSpinner } from "react-icons/cg";


export default function Pages() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  function onSignup(e) {
    e.preventDefault();
    let formErrors = {};
    if (name.length < 3) {
      formErrors.name = 'Name must be at least 3 characters long.';
    }
    if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
      formErrors.phone = 'Phone number must be 10 digits.';
    }
    if (password.length < 8 || !/\d/.test(password)) {
      formErrors.password = 'Password must be at least 8 characters long and contain at least one number.';
    }
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setLoading(true)
      handleSignUp()
    }
  }


  const handleSignUp = async () => {

    const data = { name, phone, password };
    try {
      let res = await fetch('/api/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      setLoading(false);



      let response = await res.json();
      console.log(response);
      if (response.success) {
        alert('Signup Successful')

      }
      else {
        alert(response.error)
      }
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      // console.log(error)
      alert('Signup Failed Please Try again')
    }
  };


  return (
    <div>



      <section className="bg-gradient-to-b from-white to-blue-200 h-[100vh]">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-white dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-black">
                Sign up for an account
              </h1>
              <form className="space-y-4 md:space-y-6" >
                <div>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-blue-100 dark:border-gray-600 dark:placeholder-gray-800 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Aditya"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>
                
                <div>
                  <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                    Your Phone Number
                  </label>
                  <input
                    type="number"
                    name="phone"
                    id="phone"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-blue-100 dark:border-gray-600 dark:placeholder-gray-800 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="7061652485"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-blue-100 dark:border-gray-600 dark:placeholder-gray-800 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>
                <button
                  type="submit"
                  onClick={onSignup}
                  className="bg-blue-600 w-full px-32 flex gap-1 items-center justify-center py-2.5 text-white rounded"
                >
                  {loading && (
                    <CgSpinner size={20} className="mt-1 animate-spin" />
                  )}
                  <span> Sign Up</span>
                </button>

                <p className="text-sm font-light text-gray-500 dark:text-black">
                  Already have an account?{' '}
                  <Link href="/log-in" className="font-medium text-primary-600 hover:underline dark:text-blue-500">
                    Login
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

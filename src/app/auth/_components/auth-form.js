"use client";

import { useState } from "react";

import { useSignUp, useSignIn } from "@/hooks";
import Link from "next/link";

import toast from "react-hot-toast";


/**
 * @component
 * @param {Object} props
 * @param {"signIn" | "signUp"} props.authType
 */
export const AuthForm = ({ authType }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { mutate: signUpMutation, isPending: isSignUpPending } = useSignUp();
  const { mutate: signInMutation, isPending: isSignInPending } = useSignIn();

  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData(prevFormData => {
      return {
        ...prevFormData,
        [name]: value,
      }
    });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (authType === "signUp") {
      if (formData.name === "" || formData.email === "" || formData.password === "") {
        toast.error("Some fields are empty");

        return;
      }

      signUpMutation(formData);
    }

    if (authType === "signIn") {
      if (formData.email === "" || formData.password === "") {
        toast.error("Some fields are empty");

        return;
      }

      signInMutation({ email: formData.email, password: formData.password });
    }
  }

  const formTitle = {
    signIn: "Sign in",
    signUp: "Sign up",
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 w-[370px]">
      <h1 className="font-semibold text-xl">{formTitle[authType]}</h1>

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex flex-col gap-1">
          {authType === "signUp" && (
            <div className="flex flex-col gap-1">
              <label>Full name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="bg-gray-100 py-2 px-3 rounded-lg"
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label>Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="bg-gray-100 py-2 px-3 rounded-lg"
              placeholder="Enter your email"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="bg-gray-100 py-2 px-3 rounded-lg"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSignUpPending || isSignInPending}
          className="bg-gray-900 mt-3 text-white text-sm w-full p-2.5 rounded-lg cursor-pointer disabled:opacity-70"
        >
          {(isSignUpPending || isSignInPending) ? "Loading..." : "Submit"}
        </button>
      </form>

      <div className="text-sm text-blue-400 mt-4">
        {authType === "signIn" && <Link href="/auth/sign-up">Sign up</Link>}
        {authType === "signUp" && <Link href="/auth/sign-in">Sign in</Link>}
      </div>
    </div>
  )
}

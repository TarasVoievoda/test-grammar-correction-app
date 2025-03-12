"use client";

import { useContext } from "react";

import { AuthContext } from "@/context";

import { AuthApiService } from "@/services";
import { useMutation } from "@tanstack/react-query";

import { useRouter } from "next/navigation";

import { handleToastError } from "@/errors";

import toast from "react-hot-toast";

export const useSignUp = () => {
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const { ...mutationProps } = useMutation({
    mutationFn: (data) => AuthApiService.signUp(data),
    onSuccess: (data) => {
      toast.success("Successfully logged in");
      login(data.accessToken);
      router.push("/");
    }, 
    onError: (error) => {
      handleToastError(error);
    },
  });

  return mutationProps;
}

export const useSignIn = () => {
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const { ...mutationProps } = useMutation({
    mutationFn: (data) => AuthApiService.signIn(data),
    onSuccess: (data) => {
      toast.success("Successfully logged in");
      login(data.accessToken);
      router.push("/");
    }, 
    onError: (error) => {
      handleToastError(error);
    },
  });

  return mutationProps;
}
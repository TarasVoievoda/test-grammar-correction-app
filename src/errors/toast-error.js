import toast from "react-hot-toast";

export const handleToastError = (error) => {
  const errorMessage =
    error instanceof Error ? error.message : "Something went wrong";

  toast.error(`${errorMessage}`);
};

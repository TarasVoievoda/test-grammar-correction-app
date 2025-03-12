import { useState } from "react";
import toast from "react-hot-toast";

export const useGetCorrections = () => {
  const [corrections, setCorrections] = useState([]);
  const [loading, setLoading] = useState(false);

  const checkGrammar = async (text) => {
    if (text === "") {
      setCorrections([]);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/correction", {
        method: "POST",
        body: JSON.stringify({ input: text }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 200) {
        const error = await response.json();
        throw new Error(error?.message ?? "Unknown error");
      }

      const { corrections } = await response.json();

      setCorrections(corrections);
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    corrections,
    loading,
    checkGrammar,
  }
}

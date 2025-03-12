import { useState } from "react";

import toast from "react-hot-toast";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const useGetCorrections = () => {
  const [corrections, setCorrections] = useState([]);
  const [loading, setLoading] = useState(false);

  const checkGrammar = async (text) => {
    setLoading(true);

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "Find all grammatical mistakes in the given text and return a JSON array where each item contains { word: incorrect_word, suggestion: corrected_word }. Do not return any other text." },
            {
              role: "user",
              content: text,
            },
        ],
        store: true,
      });

      if (!response.choices || !response.choices[0]?.message?.content) {
        toast.error("Error in open ai api")

        return;
      }

      let corrections = [];
      
      corrections = JSON.parse(response.choices[0].message.content);

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
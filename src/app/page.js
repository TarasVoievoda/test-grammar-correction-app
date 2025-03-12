"use client";

import { useState, useContext } from "react";

import { AuthContext } from "@/context";

// import { debounce } from "lodash";

import OpenAI from "openai";

import toast from "react-hot-toast";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default function Home() {
  const { logout } = useContext(AuthContext);

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [corrections, setCorrections] = useState([]);

  const checkGrammar = async () => {
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

  // const debouncedCheckGrammar = useCallback(debounce(checkGrammar, 1000), []);

  const handleChange = (e) => {
    const inputText = e.target.value;
    setText(inputText);
    // debouncedCheckGrammar(inputText);
  };

  const highlightedText = () => {
    if (corrections.length === 0) return text;

    const words = text.split(/\s+/);

    return (
      <>
        {words.map((word, index) => {
          const correction = corrections.find(c => c.word.toLowerCase() === word.toLowerCase());

          return correction ? (
              <span key={index} className="text-red-400 font-semibold">
                {word} <span className="text-green-500 text-normal">({correction.suggestion})</span>{" "}
              </span>
            ) : (
              word + " "
            );
          })
        }
      </>
    );
  }

  return (
    <div>
      <header>
        <div className="w-[700px] mx-auto py-2 flex justify-end">
          <button
            onClick={logout}
            className="bg-white rounded-sm py-2 px-3 text-sm"
          >
            Logout
          </button>
        </div>
      </header>
      <div className="w-[700px] mt-[150px] mx-auto">
        <div className="bg-white shadow-sm rounded-lg p-4">
          <h2 className="text-md font-bold text-gray-500">Preview</h2>
          <div className="min-h-[70px]">{highlightedText()}</div>
        </div>
        <textarea
          className="w-full p-4 rounded-lg mt-4 bg-white shadow-sm"
          rows={6}
          value={text}
          onChange={handleChange}
          placeholder="Type here..."
        />
        <button onClick={checkGrammar} className="bg-white rounded-sm py-2 px-3 text-sm">{loading ? "Loading..." : "Check grammar"}</button>
      </div>
    </div>
  );
}

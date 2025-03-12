"use client";

import { useState, useContext, useCallback } from "react";

import { AuthContext } from "@/context";

import { useGetCorrections } from "@/hooks";

import { debounce } from "lodash";

export default function Home() {
  const { logout } = useContext(AuthContext);
  const { loading, corrections, checkGrammar } = useGetCorrections();

  const [text, setText] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedCheckGrammar = useCallback(debounce(checkGrammar, 1000), []);

  const handleChange = (event) => {
    const inputText = event.target.value;

    setText(inputText);
    debouncedCheckGrammar(inputText);
  };

  const highlightedText = () => {
    if (corrections.length === 0) return text;

    const words = text.split(/\s+/);

    return (
      <>
        {words.map((word, index) => {
          const correction = corrections.find(correctionItem => correctionItem.word.toLowerCase() === word.toLowerCase());

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
        <button onClick={() => checkGrammar(text)} className="bg-white rounded-sm py-2 px-3 text-sm">{loading ? "Loading..." : "Check grammar"}</button>
      </div>
    </div>
  );
}

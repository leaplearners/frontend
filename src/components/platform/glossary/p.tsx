import React from "react";

function P() {
  return (
    <div className="px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-4 max-w-screen-2xl mx-auto min-h-screen">
      <h1 className="text-textGray font-medium md:text-lg lg:text-xl capitalize mt-6">
        Glossary
      </h1>
      <span className="text-sm text-textSubtitle">
        This tab contains videos and worksheets for the entire 11+ Maths
        syllabus. We have numbered each section of the syllabus for easy
        navigation.
      </span>

      <div className="mt-12 pb-6 border-b-2">
        <div className="flex justify-center gap-6 max-w-5xl w-full mx-auto overflow-auto scrollbar-hide">
          {Array.from({ length: 26 }, (_, i) =>
            String.fromCharCode(65 + i)
          ).map((letter) => (
            <button
              key={letter}
              className="text-textGray text-sm cursor-pointer"
            >
              {letter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default P;

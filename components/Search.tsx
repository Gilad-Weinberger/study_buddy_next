"use client";

const Search = () => {
  const handleSearch = (e: string) => {
    console.log(e);
  };

  return (
    <label className="input input-bordered flex h-[45px] w-[350px] items-center gap-2 border-none bg-[50556e]">
      <input type="text" className="grow" placeholder="Search" />
      <button onClick={() => handleSearch("sd")}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-5 w-5 opacity-70"
        >
          <path
            fillRule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </label>
  );
};

export default Search;

import { Button } from "../ui/button";
import { Input } from "../ui/input"; // Make sure this component is styled with Tailwind CSS
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <nav className="flex justify-between items-center bg-teal-500 px-4 py-2 text-white">
      <h1 className="text-xl font-bold">
        {" "}
        <Link to="/">2Cents.ai</Link>
      </h1>
      <div className="flex-grow mx-4">
        <form onSubmit={handleSearch}>
        <Input
          placeholder="Search..."
          className="w-full px-2 py-1 rounded bg-white text-black"
          type="text"
          value={searchTerm}
          onChange={handleSearchInputChange}
        />
        </form>
      </div>

      <div className="flex gap-4">
        <Button
          className="bg-teal-700 text-white px-4 py-2 rounded hover:bg-teal-600 transition-colors"
          onClick={handleSearch}
        >
          Search
        </Button>

        <Link
          to="/createpost"
          className="bg-white text-teal-500 px-4 py-2 rounded hover:bg-teal-700 hover:text-white transition-colors"
        >
          Create New Post
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

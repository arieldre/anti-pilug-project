import React from 'react';
import { useLocation } from 'react-router-dom';

const SearchResults: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');

  return (
    <div>
      <h1>Search Results</h1>
      <p>Showing results for: {query}</p>
      {/* Add logic to display search results based on the query */}
    </div>
  );
};

export default SearchResults;
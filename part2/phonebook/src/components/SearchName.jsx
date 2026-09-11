function SearchName({ searchName, onChangeSearchName }) {
  return (
    <p>
      filter shown with
      <input
        value={searchName}
        onChange={(e) => onChangeSearchName(e.target.value)}
      />
    </p>
  );
}

export default SearchName;

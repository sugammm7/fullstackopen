function AddForm({
  newName,
  onChangeNewName,
  newPhoneNum,
  onChangePhoneNum,
  onAddNumber,
}) {
  return (
    <>
      <h2>add a new</h2>
      <form>
        <div>
          name:
          <input
            value={newName}
            onChange={(e) => onChangeNewName(e.target.value)}
          />
        </div>
        <div>
          number:
          <input
            value={newPhoneNum}
            onChange={(e) => onChangePhoneNum(e.target.value)}
          />
        </div>
        <div>
          <button type="submit" onClick={onAddNumber}>
            add
          </button>
        </div>
      </form>
    </>
  );
}

export default AddForm;

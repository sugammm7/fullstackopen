import { useState } from "react";
import SearchName from "./components/SearchName";
import AddForm from "./components/AddForm";
import ContactList from "./components/ContactList";

function App() {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);
  const [newName, setNewName] = useState("");
  const [newPhoneNum, setNewPhoneNum] = useState("");
  const [searchName, setSearchName] = useState("");

  function handleAddNumber(e) {
    e.preventDefault();

    if (!newName || !newPhoneNum) {
      return;
    }

    const doesExist = !!persons.find((person) => person.name === newName);

    if (!doesExist) {
      const newObject = {
        name: newName,
        number: newPhoneNum,
      };
      setPersons(persons.concat(newObject));
    } else {
      alert(`${newName} is already added to phonebook`);
    }

    setNewName("");
    setNewPhoneNum("");
  }

  const dataToShow = searchName
    ? persons.filter((person) =>
        person.name.toLowerCase().includes(searchName.toLowerCase()),
      )
    : persons;

  return (
    <div>
      <h2>Phonebook</h2>

      <SearchName searchName={searchName} onChangeSearchName={setSearchName} />

      <AddForm
        newName={newName}
        onChangeNewName={setNewName}
        newPhoneNum={newPhoneNum}
        onChangePhoneNum={setNewPhoneNum}
        onAddNumber={handleAddNumber}
      />

      <ContactList dataToShow={dataToShow} />
    </div>
  );
}

export default App;

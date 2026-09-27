import { useEffect, useState } from "react";

import SearchName from "./components/SearchName";
import AddForm from "./components/AddForm";
import ContactList from "./components/ContactList";

import phonebookServices from "./services/phonebook";

function App() {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPhoneNum, setNewPhoneNum] = useState("");
  const [searchName, setSearchName] = useState("");

  useEffect(function () {
    phonebookServices.getAll().then((data) => {
      setPersons(data);
    });
  }, []);

  function handleUpdateNumber(id, updatedContact) {
    const replaceNumberPermission = confirm(
      `${newName} already exists in the phonebook, want to replace the number?`,
    );

    if (!replaceNumberPermission) {
      setNewName("");
      setNewPhoneNum("");
      return;
    }

    phonebookServices.updateContact(id, updatedContact).then((data) => {
      setPersons((persons) =>
        persons.map((person) => (person.id === id ? data : person)),
      );
      setNewName("");
      setNewPhoneNum("");
    });
  }

  function handleAddNumber(e) {
    e.preventDefault();

    if (!newName || !newPhoneNum) {
      return;
    }

    const newObject = {
      name: newName,
      number: newPhoneNum,
    };

    const doesExist = persons.find((person) => person.name === newName);

    if (doesExist) {
      handleUpdateNumber(doesExist.id, newObject);
      return;
    }

    phonebookServices
      .createNewContact(newObject)
      .then((data) => setPersons(persons.concat(data)));

    setNewName("");
    setNewPhoneNum("");
  }

  function handleDeleteNumber(id) {
    const personName = persons.find((person) => person.id === id).name;

    const deletePermission = confirm(`Delete ${personName}`);

    if (deletePermission) {
      phonebookServices.deleteContact(id).then(() => {
        setPersons((persons) => persons.filter((person) => person.id !== id));
      });
    }
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

      <ContactList
        dataToShow={dataToShow}
        onDeleteNumber={handleDeleteNumber}
      />
    </div>
  );
}

export default App;

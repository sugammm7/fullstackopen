import { useEffect, useState } from "react";

import SearchName from "./components/SearchName";
import AddForm from "./components/AddForm";
import ContactList from "./components/ContactList";
import Notification from "./components/Notification";

import phonebookServices from "./services/phonebook";

function App() {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPhoneNum, setNewPhoneNum] = useState("");
  const [searchName, setSearchName] = useState("");
  const [notification, setNotification] = useState(null);
  const [isSuccess, setIsSuccess] = useState(null);

  useEffect(function () {
    phonebookServices.getAll().then((data) => {
      setPersons(data);
    });
  }, []);

  function handleUpdateNumber(updatedContact) {
    const replaceNumberPermission = confirm(
      `${newName} already exists in the phonebook, want to replace the number?`,
    );

    if (!replaceNumberPermission) {
      setNewName("");
      setNewPhoneNum("");
      return;
    }

    const id = updatedContact.id;

    phonebookServices
      .updateContact(id, updatedContact)
      .then((data) => {
        setPersons((persons) =>
          persons.map((person) => (person.id === id ? data : person)),
        );

        setNotification(
          `Changed ${data.name} contact number as ${data.number}`,
        );
        setIsSuccess(true);
        setTimeout(() => {
          setNotification(null);
          setIsSuccess(null);
        }, 5000);

        setNewName("");
        setNewPhoneNum("");
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setNotification(
            `The contact ${updatedContact.name} is already removed from server`,
          );
          setPersons((persons) => persons.filter((person) => person.id !== id));
        } else {
          setNotification(err.response.data.error);
        }
        setIsSuccess(false);
        setTimeout(() => {
          setNotification(null);
          setIsSuccess(null);
        }, 5000);

        setNewName("");
        setNewPhoneNum("");
      });
  }

  function handleAddNumber(e) {
    e.preventDefault();

    if (!newName || !newPhoneNum) {
      return;
    }

    const doesExist = persons.find((person) => person.name === newName);

    if (doesExist) {
      const updatedObj = { ...doesExist, number: newPhoneNum };

      handleUpdateNumber(updatedObj);
      return;
    }

    const newObject = {
      name: newName,
      number: newPhoneNum,
    };

    phonebookServices
      .createNewContact(newObject)
      .then((data) => {
        setPersons(persons.concat(data));
        setNotification(`Added ${newName}`);
        setIsSuccess(true);
        setTimeout(() => {
          setNotification(null);
          setIsSuccess(null);
        }, 5000);
      })
      .catch((err) => {
        setNotification(err.response.data.error);
        setIsSuccess(false);
        setTimeout(() => {
          setNotification(null);
          setIsSuccess(null);
        }, 5000);
      });

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

      <Notification message={notification} isSuccess={isSuccess} />

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

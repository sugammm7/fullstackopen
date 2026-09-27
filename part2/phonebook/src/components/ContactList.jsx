import Contact from "./Contact";

function ContactList({ dataToShow, onDeleteNumber }) {
  return (
    <>
      <h2>Numbers</h2>
      <ul>
        {dataToShow.map((person) => (
          <Contact
            key={person.id}
            person={person}
            onDeleteNumber={() => onDeleteNumber(person.id)}
          />
        ))}
      </ul>
    </>
  );
}

export default ContactList;

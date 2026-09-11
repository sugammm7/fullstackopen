import Contact from "./Contact";

function ContactList({ dataToShow }) {
  return (
    <>
      <h2>Numbers</h2>
      <ul>
        {dataToShow.map((person) => (
          <Contact key={person.number} person={person} />
        ))}
      </ul>
    </>
  );
}

export default ContactList;

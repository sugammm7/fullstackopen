function Contact({ person, onDeleteNumber }) {
  return (
    <li>
      {person.name}
      <button onClick={onDeleteNumber}>delete</button>
    </li>
  );
}

export default Contact;

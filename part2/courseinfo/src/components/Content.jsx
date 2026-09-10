import Part from "./Part";

function Content({ parts }) {
  return (
    <div>
      {parts.map((part) => (
        <Part part={part} key={part.id} />
      ))}
    </div>
  );
}

export default Content;

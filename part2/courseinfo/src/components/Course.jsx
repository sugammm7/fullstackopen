import Content from "./Content";
import Header from "./Header";
import Total from "./Total";

function Course({ course }) {
  return (
    <div>
      <Header courseName={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
}

export default Course;

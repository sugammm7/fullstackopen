const calcTotal = (parts) => {
  return parts.reduce((total, curr) => {
    return total + curr.exercises;
  }, 0);
};

function Total({ parts }) {
  return (
    <p>
      <strong>total of {calcTotal(parts)} exercises</strong>
    </p>
  );
}

export default Total;

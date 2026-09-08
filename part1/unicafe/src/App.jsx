import { useState } from "react";

function App() {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  function handleGoodFeedback() {
    setGood(good + 1);
  }

  function handleNeutralFeedback() {
    setNeutral(neutral + 1);
  }

  function handleBadFeedback() {
    setBad(bad + 1);
  }

  return (
    <>
      <Feedback
        onGoodFeedback={handleGoodFeedback}
        onNeutralFeedback={handleNeutralFeedback}
        onBadFeedback={handleBadFeedback}
      />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </>
  );
}

function Feedback({ onGoodFeedback, onNeutralFeedback, onBadFeedback }) {
  return (
    <div>
      <h1>give feedback</h1>
      <Button text="good" onClick={onGoodFeedback} />
      <Button text="neutral" onClick={onNeutralFeedback} />
      <Button text="bad" onClick={onBadFeedback} />
    </div>
  );
}

function Button({ text, onClick }) {
  return <button onClick={onClick}>{text}</button>;
}

function Statistics({ good, neutral, bad }) {
  const all = good + neutral + bad;
  const average = (good - bad) / all;
  const positive = (good / all) * 100;

  if (good === 0 && neutral === 0 && bad === 0) return <p>No feedback given</p>;

  return (
    <div>
      <h1>Statistics</h1>

      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={all} />
          <StatisticLine text="average" value={average} />
          <StatisticLine text="positive" value={positive} />
        </tbody>
      </table>
    </div>
  );
}

function StatisticLine({ text, value }) {
  return (
    <tr>
      {text === "positive" ? (
        <td>
          {text} {value} %
        </td>
      ) : (
        <td>
          {text} {value}{" "}
        </td>
      )}
    </tr>
  );
}

export default App;

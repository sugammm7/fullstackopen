import { useState } from "react";

const maxVoteIndex = (votes) => {
  const maxIndex = votes.indexOf(Math.max(...votes));

  return maxIndex;
};

function App() {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];
  const anecdotesLen = anecdotes.length;

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(
    Array.from({ length: anecdotesLen }, (_, index) => index * 0),
  );

  function handleNextAnecdote() {
    const randIndex = Math.floor(Math.random() * anecdotes.length);
    setSelected(randIndex);
  }

  function handleVote() {
    const newVotes = [...votes];
    newVotes[selected] += 1;
    setVotes(newVotes);
  }

  const maxIndex = maxVoteIndex(votes);

  return (
    <>
      <Anecdote
        title="Anecdote of the day"
        anecdote={anecdotes[selected]}
        vote={votes[selected]}
      >
        <div>
          <Button text="vote" onClick={handleVote} />
          <Button text="next anecdote" onClick={handleNextAnecdote} />
        </div>
      </Anecdote>

      {votes[maxIndex] && (
        <Anecdote
          title="Anecdote with most votes"
          anecdote={anecdotes[maxIndex]}
          vote={votes[maxIndex]}
        />
      )}
    </>
  );
}

function Button({ text, onClick }) {
  return <button onClick={onClick}>{text}</button>;
}

function Anecdote({ title, anecdote, vote, children }) {
  return (
    <div>
      <h1>{title}</h1>
      <p>{anecdote}</p>
      <p>has {vote} votes</p>
      {children}
    </div>
  );
}

export default App;

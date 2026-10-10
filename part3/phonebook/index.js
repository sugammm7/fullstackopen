const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());

morgan.token("postBody", (req, res) => {
  return JSON.stringify(req.body);
});
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :postBody",
  ),
);

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  return Math.floor(Math.random() * 10000000000) + 1;
};

app.get("/info", (req, res) => {
  const noOfEntry = persons.length;
  const currentDateAndTime = new Date().toString();
  res.send(`<div>
        <p>Phonebook has info for ${noOfEntry} people</p>
        <p>${currentDateAndTime}</p>
    </div>`);
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id === id);

  if (!person) {
    return res.status(404).end();
  }

  res.status(200).json(person);
});

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({
      error: "Content is empty!",
    });
  }

  const personWithSameName = persons.find((person) => person.name === name);

  if (personWithSameName) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: generateId(),
    name,
    number,
  };

  persons = persons.concat(person);

  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`The server is listening on port ${PORT}`);
});

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const app = express();

const Person = require("./models/persons");

const url = process.env.MONGODB_URI;
mongoose
  .connect(url, { family: 4 })
  .then((res) => {
    console.log("CONNECTED TO DB ✅");
  })
  .catch((err) => {
    console.log(err.message);
    process.exit(1);
  });

app.use(express.json());

morgan.token("postBody", (req, res) => {
  return JSON.stringify(req.body);
});
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :postBody",
  ),
);

app.use(express.static("dist"));

app.get("/info", (req, res) => {
  const currentDateAndTime = new Date().toString();

  Person.find({}).then((persons) => {
    res.send(`<div>
          <p>Phonebook has info for ${persons.length} people</p>
          <p>${currentDateAndTime}</p>
      </div>`);
  });
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => res.json(persons));
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;

  Person.findById(id)
    .then((person) => {
      if (!person) {
        return res.status(404).end();
      }

      res.json(person);
    })
    .catch((err) => next(err));
});

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({
      error: "Content is empty!",
    });
  }

  const person = new Person({
    name,
    number,
  });

  person.save().then((savedDoc) => res.status(201).json(savedDoc));
});

app.put("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  const { name, number } = req.body;

  Person.findById(id)
    .then((person) => {
      if (!person) {
        return res.status(404).end();
      }

      person.name = name;
      person.number = number;

      return person.save().then((updatedPerson) => res.json(updatedPerson));
    })
    .catch((err) => next(err));
});

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;

  Person.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => next(err));
});

const errorHandler = (err, req, res, next) => {
  console.log(err.message);

  if (err.name == "CastError") {
    return res.status(500).json({ error: "malformatted id" });
  }

  next(err);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`The server is listening on port ${PORT}`);
});

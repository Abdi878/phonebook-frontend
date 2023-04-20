const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const app = express();
const Person = require("./models/person");
app.use(express.json());
morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});
app.use(express.static("build"));

app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      tokens.body(req, res),
    ].join(" ");
  })
);
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];
app.get("/", (req, res) => {
  res.send("<h1>GANG<h1>");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((people) => res.json(people));
});

app.get("/api/info", (req, res) => {
  res.send(
    `<div><p>Phonebook has info for ${
      persons.length
    } people</p> ${new Date()}</div>`
  );
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id === Number(id));
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});
app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id != Number(id));
  res.status(204).end();
});
const generateID = () => Math.floor(4 + 100 * Math.random());

app.post("/api/persons", (req, res) => {
  const body = req.body;
  console.log(req.body);
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "content missing",
    });
  }
  const names = persons.map((person) => person.name);
  if (names.includes(body.name)) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: generateID(),
    name: body.name,
    number: body.number,
  };
  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
  console.log(person);
  persons = persons.concat(person);
});

const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const app = express();
const Person = require("./models/person");
const mongoose = require("mongoose");
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

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
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
  const person = new Person({
    id: generateID(),
    name: body.name,
    number: body.number,
  });
  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

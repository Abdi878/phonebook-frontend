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
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "Validation Error") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};
app.use(errorHandler);
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

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch((error) => next(error));
});
const generateID = () => Math.floor(4 + 100 * Math.random());

app.post("/api/persons", (req, res,next) => {
  const body = req.body;
  console.log(req.body);
  const person = new Person({
    id: generateID(),
    name: body.name,
    number: body.number,
  });
  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;
  const person = {
    name: body.name,
    number: body.number,
  };
  Person.findByIdAndUpdate(req.params.id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((newPerson) => res.json(newPerson))
    .catch((error) => next(error));
});

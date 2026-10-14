const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Enter the password to connect to database.");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.ptyasox.mongodb.net/phonebook?appName=Cluster0`;

mongoose.connect(url, { family: 4 });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

switch (process.argv.length) {
  case 3:
    console.log("phonebook: ");
    Person.find({}).then((data) => {
      data.forEach((person) => console.log(`${person.name} ${person.number}`));
      mongoose.connection.close();
    });
    break;

  case 5:
    const name = process.argv[3];
    const number = process.argv[4];

    const person = new Person({
      name,
      number,
    });

    person.save().then((doc) => {
      console.log(`added ${doc.name} number ${doc.number} to phonebook`);
      mongoose.connection.close();
    });
    break;

  default:
    console.log("Invalid number of arguments.");
    mongoose.connection.close();
    break;
}

class Contact {
  constructor(
    id,
    name,
    email,
    message,
    selectedOption,
    date,
    comment
  ) {
    this.id = id; // represents the id generated by the firestore
    this.name = name;
    this.email = email;
    this.message = message;
    this.selectedOption = selectedOption;
    this.date = date;
    this.comment = comment;
  }
}

module.exports = Contact;

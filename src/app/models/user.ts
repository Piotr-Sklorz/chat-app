export class User {
  email!: String;
  firstName!: String;
  lastName!: String;
  username!: String;

  constructor(email: String, firstName: String, lastName: String, username: String) {
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
  }
}

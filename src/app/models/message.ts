export class Message {
  sender: String | undefined;
  message: String | undefined;

  constructor(sender: String | undefined, message: String | undefined) {
    this.sender = sender;
    this.message = message;
  }
}

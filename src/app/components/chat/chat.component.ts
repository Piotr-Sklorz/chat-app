import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Message } from 'src/app/models/message';
import { User } from 'src/app/models/user';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @Input('selectedUser') selectedUser: User | undefined;
  @Input('currentUser') currentUser: User | undefined;

  faPaperPlane = faPaperPlane;
  messages: Array<Message> = new Array<Message>();
  messageText!: String;

  constructor(private _chatService: ChatService) {
    this._chatService.newUserJoined()
    .subscribe(data => {this.messages = data;
    this.messages.forEach(it => console.log(it.message, it.sender))});
    this._chatService.userLeftRoom()
    .subscribe(data => this.messages.splice(0, this.messages.length));
    this._chatService.newMessageReceived()
    .subscribe(data => this.messages.push(new Message(data.username, data.message)));
  }

  ngOnInit(): void {
  }

  sendMessage() {
    if (this.messageText !== null && this.messageText !== '' && this.messageText.length > 0 && this.currentUser) {
      this._chatService.sendMessage(this.currentUser.username, this.messageText);
      this.messageText = '';
    }
  }

}

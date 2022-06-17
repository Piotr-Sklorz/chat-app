import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { firstValueFrom, Observable } from 'rxjs';
import { HttpRequestsService } from '../http-requests/http-requests.service';
import { User } from 'src/app/models/user';
import { Message } from 'src/app/models/message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket = io('http://192.168.0.73:3000');
  private roomId: String = '';

  constructor(private _httpRequestsService: HttpRequestsService) { }

  joinRoom(currentUser: User, selectedUser: User) {
    firstValueFrom(this._httpRequestsService.getRoomId(selectedUser.email))
    .then(data => {
      this.socket.emit('join', {
        username: currentUser.username,
        room: Object.values(data)[0]
      });
      this.roomId = Object.values(data)[0];
    });
  }

  newUserJoined() {
    let observable = new Observable<Array<Message>>(observer => {
      this.socket.on('new user joined', data => {
        firstValueFrom(this._httpRequestsService.getMessages(this.roomId.toString()))
          .then(data => observer.next(this.json2array(data)));
      });
      return () => { this.socket.disconnect(); }
    });
    return observable;
  }

  leaveRoom(currentUser: User, selectedUser: User) {
    firstValueFrom(this._httpRequestsService.getRoomId(selectedUser.email))
    .then(data => this.socket.emit('leave', {
      username: currentUser.username,
      room: Object.values(data)[0]
    }));
  }

  userLeftRoom() {
    let observable = new Observable<{ username: String, message: String}>(observer => {
      this.socket.on('left room', data => observer.next(data));
      return () => { this.socket.disconnect(); }
    });
    return observable;
  }
  
  cahngeRoom(currentUser: User, selectedUser: User) {
    if (this.roomId !== '') {
      this.socket.emit('leave', {
        username: currentUser.username,
        room: this.roomId
      });
      this.roomId = '';
      this.joinRoom(currentUser, selectedUser);
    }
  }

  sendMessage(sender: String, message: String) {
    firstValueFrom(this._httpRequestsService.sendMessage(message, sender, this.roomId))
    .then(data => console.log(data));

    this.socket.emit('message', {
      username: sender,
      room: this.roomId,
      message: message
    });
  }

  newMessageReceived() {
    let observable = new Observable<{ username: String, message: String}>(observer => {
      this.socket.on('new message', data => observer.next(data));
      return () => { this.socket.disconnect(); }
    });
    return observable;
  }

  json2array(json: any): Array<Message> {
    var result = Array();
    var keys = Object.keys(json);
    keys.forEach(function(key) {
      result.push(
        new Message(json[key]['sender'], json[key]['message']));
    });
    return result;
  }

}

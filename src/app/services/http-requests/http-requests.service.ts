import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestsService {
  serverUrl = 'http://192.168.0.73:3000/';

  constructor(private _httpClient: HttpClient) { }

  //#region /users

  register(body: any) {
    return this._httpClient.post(this.serverUrl + 'users/register', body, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  login(body: any) {
    return this._httpClient.post(this.serverUrl + 'users/login', body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  getUsers() {
    return this._httpClient.get(this.serverUrl + 'users', {
      observe: 'body'
    });
  }

  getCurrentUser() {
    return this._httpClient.get(this.serverUrl + 'users/current', {
      observe: 'body',
      withCredentials: true
    });
  }

  addFriend(currentUser: User, addingUser: User) {
    return this._httpClient.patch(this.serverUrl + 'users/friends/add', {
      currentUserEmail: currentUser.email,
      currentUserFirstName: currentUser.firstName,
      currentUserLastName: currentUser.lastName,
      currentUserUsername: currentUser.username,
      addingUserEmail: addingUser.email,
      addingUserFirstName: addingUser.firstName,
      addingUserLastName: addingUser.lastName,
      addingUserUsername: addingUser.username
    });
  }

  sendInvitation(currentUser: User, addingUser: User) {
    return this._httpClient.patch(this.serverUrl + 'users/invitations/add', {
      currentUserEmail: currentUser.email,
      currentUserFirstName: currentUser.firstName,
      currentUserLastName: currentUser.lastName,
      currentUserUsername: currentUser.username,
      addingUserEmail: addingUser.email,
      addingUserFirstName: addingUser.firstName,
      addingUserLastName: addingUser.lastName,
      addingUserUsername: addingUser.username
    });
  }

  removeFriend(currentUserEmail: String, addingUserEmail: String) {
    return this._httpClient.patch(this.serverUrl + 'users/friends/remove', {
      currentUserEmail: currentUserEmail,
      removingUserEmail: addingUserEmail
    });
  }

  removeInvitation(currentUserEmail: String, addingUserEmail: String) {
    return this._httpClient.patch(this.serverUrl + 'users/invitations/remove', {
      currentUserEmail: currentUserEmail,
      removingUserEmail: addingUserEmail
    });
  }

  getFriends() {
    return this._httpClient.get(this.serverUrl + 'users/friends', {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  getInvitations() {
    return this._httpClient.get(this.serverUrl + 'users/invitations', {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  isUserAuthenticated() {
    return this._httpClient.get(this.serverUrl + 'users/isUserAuthenticated', {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  logout() {
    return this._httpClient.delete(this.serverUrl + 'users/logout', {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  //#endregion

  //#region /messages

  getRoomId(email: String) {
    return this._httpClient.get(this.serverUrl + 'messages/' + email, {
      observe: 'body',
      withCredentials: true
    });
  }

  sendMessage(message: String, sender: String, roomId: String) {
    return this._httpClient.post(this.serverUrl + 'messages', {
      message: message,
      roomId: roomId,
      sender: sender
    }, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  getMessages(roomId: string) {
    return this._httpClient.post(this.serverUrl + 'messages/getAllByRoomId', {
      roomId: roomId
    }, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  //#endregion

}

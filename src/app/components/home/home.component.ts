import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { User } from 'src/app/models/user';
import { ChatService } from 'src/app/services/chat/chat.service';
import { HttpRequestsService } from 'src/app/services/http-requests/http-requests.service';
import { FriendsAddComponent } from '../friends-add/friends-add.component';
import { FriendsListComponent } from '../friends-list/friends-list.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentUser: User = new User('', '', '', '');
  selectedUser!: User;
  isShowRoute!: boolean;

  constructor(private _httpRequestsService: HttpRequestsService,
    private _chatService: ChatService,
    private _router: Router) {
    firstValueFrom(this._httpRequestsService.isUserAuthenticated())
    .then(data => this.onUserAuthenticatedReceived(data))
    .catch(err => console.log(err));
    this.isShowRoute = this._router.url.includes('show');
  }

  ngOnInit(): void { }

  onUserAuthenticatedReceived(data: any) {
    if (data.isAuthenticated) {
      if (!this._router.url.includes('friends')) {
        this._router.navigate(['/home', {outlets:{friends:'show'}}]);
      } else {
        this.isShowRoute = this._router.url.includes('show');
        firstValueFrom(this._httpRequestsService.getCurrentUser())
        .then(data => this.onDataReceived(data));
      }
    } else {
      this._router.navigate(['/login']);
    }
  }

  onDataReceived(data: any): User {
    this.currentUser.email = data.email;
    this.currentUser.firstName = data.firstName;
    this.currentUser.lastName = data.lastName;
    this.currentUser.username = data.username;
    this._chatService.joinRoom(this.currentUser, this.currentUser);
    this.selectedUser = data;
    return new User(data.email, data.firstName, data.lastName, data.username);
  }
  
  async onOutletLoaded(component: FriendsListComponent | FriendsAddComponent) {
    if (component instanceof FriendsListComponent) {
      component.friendsList = await firstValueFrom(this._httpRequestsService.getFriends())
      .then(data => this.json2array(this.getFriendsFromData(data)));
      component.currentUser = this.currentUser;
      this.isShowRoute = true;
      component.selectedUserChangeEvent.subscribe(data => {
        this.selectedUser = data;
        this._chatService.cahngeRoom(this.currentUser, data);
      });
    } else if (component instanceof FriendsAddComponent) {
      component.currentUser = this.currentUser;
      this.isShowRoute=false;
    }
  }

  getFriendsFromData(data: any): Array<User> {
    return data.friends;
  }

  onFriendsListReceived(array: Array<User>): Promise<Array<User>> {
    return firstValueFrom(this._httpRequestsService.getUsers())
    .then(data => this.getArrayWithoutSecondArrayRecords(this.json2array(data), array));
  }
  
  getArrayWithoutSecondArrayRecords(array1: Array<User>, array2: Array<User>): Array<User> {
    return array1.filter(obj => !array2.some(o => obj.email === o.email));
  }

  json2array(json:any): Array<User> {
    var result = Array();
    var keys = Object.keys(json);
    keys.forEach(function(key) {
      result.push(
        new User(json[key]['email'], json[key]['firstName'], json[key]['lastName'], json[key]['username']));
    });
    return result;
  }

}

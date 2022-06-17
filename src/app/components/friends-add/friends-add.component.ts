import { Component, Input, OnInit } from '@angular/core';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { firstValueFrom } from 'rxjs';
import { InvitationUser } from 'src/app/models/invitationUser';
import { User } from 'src/app/models/user';
import { HttpRequestsService } from 'src/app/services/http-requests/http-requests.service';

@Component({
  selector: 'app-friends-add',
  templateUrl: './friends-add.component.html',
  styleUrls: ['./friends-add.component.css']
})
export class FriendsAddComponent implements OnInit {
  @Input('currentUser') currentUser!: User;
  faEllipsisV = faEllipsisV;
  hasInvitations: boolean = false;
  invitationsList!: Array<InvitationUser>;
  usersList!: Array<User>;

  constructor(private _httpRequestsService: HttpRequestsService) {
    this.getInvitations();
    this.getUsersToAdd();
  }

  ngOnInit(): void {
  }

  async getInvitations() {
    this.invitationsList = await firstValueFrom(this._httpRequestsService.getInvitations())
    .then(data => this.json2array_invitation(this.getInvitationsFromData(data)));

    this.hasInvitations = this.invitationsList.length > 0;
  }

  async getUsersToAdd() {
    this.usersList = await firstValueFrom(this._httpRequestsService.getUsers())
    .then(async data => {
      var friendsList = await firstValueFrom(this._httpRequestsService.getFriends())
      .then(data => this.json2array(this.getFriendsFromData(data)));
      var invitations = await firstValueFrom(this._httpRequestsService.getInvitations())
      .then(data => this.json2array(this.getInvitationsFromData(data)));
      data = this.getArrayWithoutSecondArrayRecords(this.json2array(data), friendsList);
      return this.getArrayWithoutSecondArrayRecords(this.json2array(data), invitations);
    });
  }

  async sendInvitation(user: User) {
    this.usersList = await firstValueFrom(this._httpRequestsService.sendInvitation(this.currentUser, user))
    .then(() => this.usersList.filter(obj => obj.email !== user.email))
  }

  async removeInvitation(email: String) {
    this.invitationsList = await firstValueFrom(this._httpRequestsService.removeInvitation(this.currentUser.email, email))
    .then(() => this.invitationsList.filter(obj => obj.user.email !== email));
    
    this.hasInvitations = this.invitationsList.length > 0;
  }

  async acceptInvitation(user: User) {
    await firstValueFrom(this._httpRequestsService.addFriend(this.currentUser, user))
    .then(async () => {
      await this.removeInvitation(user.email);
      await firstValueFrom(this._httpRequestsService.removeInvitation(user.email, this.currentUser.email));
    });
  }

  removeFromUsersList(email: String) {
    this.usersList = this.usersList.filter(obj => obj.email !== email);
  }

  getFriendsFromData(data: any): Array<User> {
    return data.friends;
  }

  getInvitationsFromData(data: any): Array<User> {
    return data.invitations;
  }

  getArrayWithoutSecondArrayRecords(array1: Array<User>, array2: Array<User>): Array<User> {
    return array1.filter(obj => !array2.some(o => obj.email === o.email));
  }

  json2array(json: any): Array<User> {
    var result = Array();
    var keys = Object.keys(json);
    keys.forEach(function(key) {
      result.push(
        new User(json[key]['email'], json[key]['firstName'], json[key]['lastName'], json[key]['username']));
    });
    return result;
  }

  json2array_invitation(json: any): Array<InvitationUser> {
    var result = Array();
    var keys = Object.keys(json);
    keys.forEach(function(key) {
      result.push(
        new InvitationUser(new User(json[key]['email'], json[key]['firstName'], json[key]['lastName'], json[key]['username']),
        json[key]['isMyRequest']));
    });
    return result;
  }

}

import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { firstValueFrom } from 'rxjs';
import { User } from 'src/app/models/user';
import { HttpRequestsService } from 'src/app/services/http-requests/http-requests.service';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css']
})
export class FriendsListComponent implements OnInit {
  @Input('friendsList') friendsList!: Array<User>;
  @Input('currentUser') currentUser!: User;
  @Output() selectedUserChangeEvent = new EventEmitter<User>();
  faEllipsisV = faEllipsisV;
  
  constructor(private _httpRequestsService: HttpRequestsService,
    private _router: Router) { }

  ngOnInit(): void {
  }

  selectedUserChange(user: User) {
    this.selectedUserChangeEvent.emit(user); 
  }

  async removeFriend(email: String) {
    this.friendsList = await firstValueFrom(this._httpRequestsService.removeFriend(this.currentUser.email, email))
    .then(() => this.friendsList.filter(obj => obj.email !== email));
  }

}

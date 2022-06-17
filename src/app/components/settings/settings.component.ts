import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpRequestsService } from 'src/app/services/http-requests/http-requests.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  username = '';

  constructor(private _httpRequestsService: HttpRequestsService) {
    firstValueFrom(this._httpRequestsService.isUserAuthenticated())
    .then(data => this.onUserAuthenticatedReceived(data));
  }

  ngOnInit(): void {
  }

  onUserAuthenticatedReceived(data: any) {
    if (data.isAuthenticated) {
      firstValueFrom(this._httpRequestsService.getCurrentUser())
      .then(data => this.onDataReceived(data));
    }
  }

  onDataReceived(data: any) {
    this.username = data.username;
  }

}

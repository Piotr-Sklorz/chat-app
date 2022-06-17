import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faPowerOff, faCog, faHome } from '@fortawesome/free-solid-svg-icons';
import { firstValueFrom } from 'rxjs';
import { HttpRequestsService } from 'src/app/services/http-requests/http-requests.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Input('username') username: String | undefined;
  faPowerOff = faPowerOff;
  faCog = faCog;
  faHome = faHome;

  constructor(private _httpRequestsService: HttpRequestsService,
    private _router: Router) {
  }

  ngOnInit(): void {
  }

  logout() {
    firstValueFrom(this._httpRequestsService.logout())
    .then(data => this._router.navigate(['/login']))
    .catch(err => console.log(err));
  }

}

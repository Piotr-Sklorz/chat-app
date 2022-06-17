import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { HttpRequestsService } from 'src/app/services/http-requests/http-requests.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  submitted!: boolean;
  incorrectEmail!: boolean;
  incorrectPassword!: boolean;

  constructor(private _formBuilder: FormBuilder,
    private _httpRequestsService: HttpRequestsService,
    private _router: Router) {
    this.loginForm = new FormGroup({
      email: new FormControl(''),
      password: new FormControl('')
    });
    this.submitted = false;
    this.incorrectEmail = false;
    this.incorrectPassword = false;
    firstValueFrom(this._httpRequestsService.isUserAuthenticated())
    .then(data => this.onUserAuthenticatedReceived(data))
    .catch(err => console.log(err));
  }

  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required]
    });
  }

  onUserAuthenticatedReceived(data: any) {
    if (data.isAuthenticated) {
      this._router.navigate(['/home', { outlets: { friends: 'show' }}]);
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    firstValueFrom(this._httpRequestsService.login(JSON.stringify(this.loginForm.value, null, 2)))
    .then(data => {
      console.log(data);
      this._router.navigate(['/home', { outlets: { friends: 'show' }}]);
    })
    .catch(err => {
      if (err.error === 'Incorrect username.') {
        this.incorrectEmail = true;
      } else if (err.error === 'Incorrect password.') {
        this.incorrectPassword = true;
      }
    });
  }

  onChange(value: string): void {
    switch (value) {
      case 'email':
        this.incorrectEmail = false;
        break;
      case 'password':
        this.incorrectPassword = false;
        break;
    }
  }

}

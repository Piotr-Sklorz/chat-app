import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { HttpRequestsService } from 'src/app/services/http-requests/http-requests.service';
import Validation from '../../utils/validation';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  submitted!: boolean;
  emailIsAlreadyTaken!: boolean;
  usernameIsAlreadyTaken!: boolean;

  constructor(private _formBuilder: FormBuilder,
    private _httpRequestsService: HttpRequestsService,
    private _router: Router) {
      this.registerForm = new FormGroup({
        email: new FormControl(''),
        firstName: new FormControl(''),
        lastName: new FormControl(''),
        username: new FormControl(''),
        password: new FormControl(''),
        confirmPassword: new FormControl('')
      });
      this.submitted = false;
      this.emailIsAlreadyTaken = false;
      this.usernameIsAlreadyTaken = false;
    firstValueFrom(this._httpRequestsService.isUserAuthenticated())
    .then(data => this.onUserAuthenticatedReceived(data))
    .catch(err => console.log(err));
  }

  ngOnInit(): void {
    this.registerForm = this._formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern('[A-z]*')]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern('[A-z]*')]],
      username: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
      confirmPassword: ['', Validators.required]
    },
    {
      validators: [Validation.match('password', 'confirmPassword')]
    });
  }

  onUserAuthenticatedReceived(data: any) {
    if (data.isAuthenticated) {
      this._router.navigate(['/home', { outlets: { friends: 'show' }}]);
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    firstValueFrom(this._httpRequestsService.register(JSON.stringify(this.registerForm.value, null, 2)))
    .then(data => {
      console.log(data);
      this._router.navigate(['/login']);
    })
    .catch( err => {
      if (err.error === 'Email is already exist.') {
        this.emailIsAlreadyTaken = true;
      } else if (err.error === 'Username is already exist.') {
        this.usernameIsAlreadyTaken = true;
      }
    });
  }

  onChange(value: string): void {
    switch (value) {
      case 'email':
        this.emailIsAlreadyTaken = false;
        break;
      case 'username':
        this.usernameIsAlreadyTaken = false;
        break;
    }
  }

}

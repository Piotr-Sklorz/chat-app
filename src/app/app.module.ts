import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpRequestsService } from './services/http-requests/http-requests.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FriendsListComponent } from './components/friends-list/friends-list.component';
import { ChatComponent } from './components/chat/chat.component';
import { FriendsAddComponent } from './components/friends-add/friends-add.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ChatService } from './services/chat/chat.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    PageNotFoundComponent,
    NavbarComponent,
    FriendsListComponent,
    ChatComponent,
    FriendsAddComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    HttpRequestsService,
    ChatService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

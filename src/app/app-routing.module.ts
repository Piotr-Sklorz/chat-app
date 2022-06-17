import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FriendsAddComponent } from './components/friends-add/friends-add.component';
import { FriendsListComponent } from './components/friends-list/friends-list.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RegisterComponent } from './components/register/register.component';
import { SettingsComponent } from './components/settings/settings.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, children: [
    { path: 'show', component: FriendsListComponent, outlet: 'friends' },
    { path: 'add', component: FriendsAddComponent, outlet: 'friends' }
  ]},
  { path: 'settings', component: SettingsComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { User } from "./user";

export class InvitationUser {
  user: User;
  isMyRequest: boolean;

  constructor(user: User, isMyRequest: boolean) {
    this.isMyRequest = isMyRequest;
    this.user = user;
  }
}

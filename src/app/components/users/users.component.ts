import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: User[] = [];

  constructor(public userService:UserService) { }

  ngOnInit(): void {
    this.userService.getUsers().subscribe( users  =>{
      this.users = <User[]>users
    })
  }

  select(){
    
  }


}

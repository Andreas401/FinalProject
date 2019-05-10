import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(){
    if(localStorage.getItem('isLoggedIn')){
      this.authService.login().subscribe(result => {
        this.router.navigate(['/map']);
      });
    }
  }

  clickLogout() {
    localStorage.clear();
    this.authService.isLoggedIn = false;
    this.authService.logout();
    this.router.navigate(["/login"]);
  }

  title = 'finalproject';

}

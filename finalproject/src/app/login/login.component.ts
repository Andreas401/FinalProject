import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm;
  credentials = false;
  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router, private authService: AuthService) {

  }

  ngOnInit() {

    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

  }

  //Go to register view
  registerButton(){
    this.router.navigate(["/register"]);
  }


  onSubmit(form) {
    if (form.valid) {
      var user = {
        "email": form.value.email,
        "password": form.value.password
      }

      //Using api service to login
      this.apiService.login(user).subscribe(response => {
        var json;
        json = JSON.parse(response);
        if (json.code == 200) {
          //Using authService to set variables to let system know you are logged in
          this.authService.login().subscribe(result => {
            window.localStorage.setItem("isLoggedIn", "true");
            window.localStorage.setItem("orgid", json.orgid);
            this.router.navigate(['/map']);
          });

        } else {
          console.log("wrong credentials");
          this.credentials = true;
        }
      });

    }
  }

}

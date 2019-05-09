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
  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router, private authService: AuthService) {

  }



  ngOnInit() {

    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

  }


  onSubmit(form) {
    if (form.valid) {
      var user = {
        "email": form.value.email,
        "password": form.value.password
      }
      this.apiService.login(user).subscribe(response => {
        console.log(response);
        if (response == '200') {
          this.authService.login().subscribe(result => {
            window.localStorage.setItem("isLoggedIn", "true");
            this.router.navigate(['/map']);
          });

        } else {
          console.log("wrong credentials");
        }
      });

    }
  }

}

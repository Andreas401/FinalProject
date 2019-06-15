import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm;
  repasswordMatch = true;
  userExist = false;

  kommuner = [];

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router, private authService: AuthService, public modalService: NgbModal) { }

  ngOnInit() {

    //Getting all "kommuner" for list
    this.apiService.getKommuner().subscribe(response => {
      //console.log("my response: " + JSON.stringify(response['results'].rows));
      this.kommuner = response['results'].rows;
      console.log("my kommuner: " + this.kommuner[0].kommune);
    });

    //Setting a timer to make it wait for "kommuner" to load
    setTimeout(() => {
      console.log("kommuner: " + this.kommuner);
      var select = document.getElementById('selectKommune');

      for (var i = 0; i < this.kommuner.length; i++) {
        var opt = this.kommuner[i];
        var el = document.createElement("option");
        console.log(opt);
        el.textContent = opt.kommune;
        el.value = opt.komid;
        select.appendChild(el);
      }


    }, 300);


    this.registerForm = this.fb.group({
      navn: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      repassword: ['', Validators.required],
      selectKommune: ['', Validators.required],
    });

  }

  onSubmit(form) {
    
    if (form.valid && (form.value.password == form.value.repassword)) {

      var info = {
        "navn": form.value.navn,
        "email": form.value.email,
        "password": form.value.password,
        "orgid": form.value.selectKommune,
      }

      //Using api to add a new user
      this.apiService.register(info).subscribe(response => {
        var json;
        json = JSON.parse(response);
        if(json.code == 200){
          this.router.navigate(['/login']);
        }else{
          this.userExist = true;
        }
      });

    }
    else{
      this.repasswordMatch = false;
      console.log("password does not match eachother");
    }
  }

}

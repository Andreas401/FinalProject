import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { MapComponent } from '../map.component';

@Component({
  selector: 'app-addpinpoint',
  templateUrl: './addpinpoint.component.html',
  styleUrls: ['./addpinpoint.component.scss']
})
export class AddpinpointComponent implements OnInit {

  addPointForm;

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router, private authService: AuthService, private mapLoad: MapComponent) { }

  ngOnInit() {
    this.addPointForm = this.fb.group({
      coorA: ['', Validators.required],
      coorB: ['', Validators.required],
      title: ['', Validators.required],
      subTitle: ['', Validators.required],
      text: ['', Validators.required]
    });
  }
  onSubmit(form) {
    if (form.valid) {

      var newPin = {
        "title": form.value.title,
        "subTitle": form.value.subTitle,
        "text": form.value.text,
        "coorA": form.value.coorA,
        "coorB": form.value.coorB,
        "orgid": 1
      }
      this.apiService.addPoint(newPin).subscribe(response => {
        console.log(response);
        this.mapLoad.loadMap();
      });
      
    }
  }

}

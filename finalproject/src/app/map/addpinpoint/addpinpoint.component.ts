import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { MapComponent } from '../map.component';


@Component({
  selector: 'app-addpinpoint',
  templateUrl: './addpinpoint.component.html',
  styleUrls: ['./addpinpoint.component.scss']
})
export class AddpinpointComponent implements OnInit {

  addPointForm;

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router, private map: MapComponent) { }

  ngOnInit() {
    this.addPointForm = this.fb.group({
      adresse: ['', Validators.required],
      title: ['', Validators.required],
      subTitle: ['', Validators.required],
      text: ['', Validators.required]
    });
  
  }

  //Closing the add point view
  close(){
    this.router.navigateByUrl('/map');
  }

  onSubmit(form) {
    if (form.valid) {

      var newPin = {
        "adresse": form.value.adresse,
        "title": form.value.title,
        "subTitle": form.value.subTitle,
        "text": form.value.text,
        "coorA": 0,
        "coorB": 0,
        "orgid": 1
      }

      //Using the api from dev.virtualearth to make it get longitude and latitude by adress
      this.apiService.getLocationByAddress(newPin.adresse).subscribe(response => {
        //console.log(response.resourcesSets[0].resources[0].point.coordinates);
        newPin.coorA = response["resourceSets"][0].resources[0].point.coordinates[0];
        newPin.coorB = response["resourceSets"][0].resources[0].point.coordinates[1];
        //Using api to add a new point
        this.apiService.addPoint(newPin).subscribe(response => {
          this.map.loadMap();
        });
      });

      
    }
  }

}

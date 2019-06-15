import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MapComponent } from '../map.component';

@Component({
  selector: 'app-editpoint',
  templateUrl: './editpoint.component.html',
  styleUrls: ['./editpoint.component.scss']
})
export class EditpointComponent implements OnInit {

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router, private authService: AuthService, private map: MapComponent) { }

  editpointForm;


  ngOnInit() {

    if(window.localStorage.getItem('selectedPinTitle') == null){
      this.router.navigate(['/map']);
    }

    //Making a form group
    this.editpointForm = this.fb.group({

      title: [window.localStorage.getItem('selectedPinTitle'), Validators.required],
      subTitle: [window.localStorage.getItem('selectedPinSubTitle'), Validators.required],
      text: [window.localStorage.getItem('selectedPinText'), Validators.required]
    });

  }


  //Function to close down the edit view
  close() {
    this.router.navigateByUrl('/map');
  }


  onSubmit(form) {
    if (form.valid) {

      //Making a point variable
      var newPin = {
        "pinid": window.localStorage.getItem('selectedPin'),
        "title": form.value.title,
        "subTitle": form.value.subTitle,
        "text": form.value.text,
        "coorA": 0,
        "coorB": 0,
        "orgid": window.localStorage.getItem('selectedPinOrg')
      }

      //console.log(response.resourcesSets[0].resources[0].point.coordinates);
      console.log(newPin);
      //Using the api to update a point
      this.apiService.editPoint(newPin).subscribe(response => {
        this.map.loadMap();
        window.localStorage.removeItem("selectedPin");
        window.localStorage.removeItem("selectedPinTitle");
        window.localStorage.removeItem("selectedPinSubTitle");
        window.localStorage.removeItem("selectedPinOrg");
        window.localStorage.removeItem("selectedPinText");
        
      });
      /*this.apiService.addPoint(newPin).subscribe(response => {
  console.log(response);
  this.map.loadMap();
});*/

    }
  }

}

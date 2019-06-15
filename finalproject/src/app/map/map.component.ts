/// <reference path="../../../node_modules/bingmaps/types/MicrosoftMaps/Microsoft.Maps.All.d.ts" />
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {


  map;
  selectedPoint;
  searchManager;
  deletePin;
  canEdit = true;


  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router, private authService: AuthService) {

  }

  //Function for loading in the map with all the points
  loadMap() {

    console.log("Deleter pin: " + this.deletePin);
    window.localStorage.removeItem("selectedPin");
    window.localStorage.removeItem("selectedPinTitle");
    window.localStorage.removeItem("selectedPinSubTitle");
    window.localStorage.removeItem("selectedPinOrg");
    window.localStorage.removeItem("selectedPinText");

    var allPins;

    this.apiService.getAllPoints().subscribe((response) => {
      console.log(response['results'].rows);
      allPins = response['results'].rows;
      console.log("My pins: " + allPins[0].pointtitle);
    });


    //Timeout to make it wait to load the points
    setTimeout(() => {

      //Link til search by address: https://www.bing.com/api/maps/sdkrelease/mapcontrol/isdk/searchbyaddress

      this.map = new Microsoft.Maps.Map(document.getElementById('mapBody'), {
        credentials: 'Aldes22t6EfUj8rrbjsc6wwjvCTabWgcmCjHLDHw3ffZWrdaeLnRgt6uKPs2kAD5'
      });

      var infobox = new Microsoft.Maps.Infobox(this.map.getCenter(), {
        visible: false,
      });

      infobox.setMap(this.map);

      var point;
      var pin;

      for (var i = 0; i < allPins.length; i++) {

        var color = 'red'; 
        if (allPins[i].added == 1) {
          color = 'red';
        } else if (allPins[i].added == 2) {
          color = 'blue';
        } else {
          color = 'green';
        }
        point = new Microsoft.Maps.Location(allPins[i].pointcoora, allPins[i].pointcoorb);
        pin = new Microsoft.Maps.Pushpin(point, {
          title: allPins[i].pointtitle,
          subTitle: allPins[i].pointsubtitle,
          color: color
        });
        pin.metadata = {
          text: allPins[i].pointtext,
          orgid: allPins[i].orgid,
          pinid: allPins[i].pointid,
          title: allPins[i].pointtitle,
          subtitle: allPins[i].pointsubtitle

        }
        this.map.entities.push(pin);
        Microsoft.Maps.Events.addHandler(pin, 'click', function (e) {
          if (window.localStorage.getItem("orgid") == e.target.metadata.orgid) {


            window.localStorage.setItem("selectedPin", e.target.metadata.pinid);
            window.localStorage.setItem("selectedPinOrg", e.target.metadata.orgid);
            window.localStorage.setItem("selectedPinTitle", e.target.metadata.title);
            window.localStorage.setItem("selectedPinSubTitle", e.target.metadata.subtitle);
            window.localStorage.setItem("selectedPinText", e.target.metadata.text);

            console.log("Get my pinid: " + window.localStorage.getItem("selectedPin"));
          }
          infobox.setOptions({
            location: e.target.getLocation(),
            title: e.target.metadata.text,
            visible: true
          });
        });

      }


    }, 300);

  }





  //Function to make go to editPoint if a point is selected
  goToEdit() {
    if (window.localStorage.getItem('selectedPinTitle') == null) {
      this.canEdit = false;

    } else {
      this.canEdit = true;
      this.router.navigate(["/map/editpoint"]);
    }
  }


  //Function to delete a selected point
  deletePins() {
    var pinid = window.localStorage.getItem("selectedPin");
    var pinorg = window.localStorage.getItem("selectedPinOrg");
    var userorg = window.localStorage.getItem("orgid");
    if (window.localStorage.getItem('selectedPinTitle') == null) {
      this.canEdit = false;

    } else {
      this.canEdit = true;
      if (pinorg == userorg) {
        var data = {
          "pinid": pinid,
          "orgid": pinorg
        };

        this.apiService.deletePin(data).subscribe((response) => {
          console.log(response);
        });
        this.loadMap();
      }
    }
  }

  ngOnInit() {

    //Checking if you are logged in
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
    }

    this.loadMap();

  }
}

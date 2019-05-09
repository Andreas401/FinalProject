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

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router, private authService: AuthService) {
  }

  loadMap(){

    var allPins;

    this.apiService.getAllPoints().subscribe((response) => {
      console.log(response['results'].rows);
      allPins = response['results'].rows;
      console.log("My pins: " + allPins[0].pointtitle);
    });


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

        point = new Microsoft.Maps.Location(allPins[i].pointcoora, allPins[i].pointcoorb);
        pin = new Microsoft.Maps.Pushpin(point, {
          title: allPins[i].pointtitle,
          subTitle: allPins[i].pointsubtitle,
        });
        pin.metadata = {
          title: allPins[i].pointtext
        }
        Microsoft.Maps.Events.addHandler(pin, 'click', function (e) {
          infobox.setOptions({
            location: e.target.getLocation(),
            title: e.target.metadata.title,
            visible: true
          });
        });
        this.map.entities.push(pin);
      }


    }, 300);

  }



  ngOnInit() {

    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
    }

    this.loadMap();


  }




}

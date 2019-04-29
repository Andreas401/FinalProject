/// <reference path="../../../node_modules/bingmaps/types/MicrosoftMaps/Microsoft.Maps.All.d.ts" />
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {

  }


  ngAfterViewInit() {
    setTimeout(() => {
    var map = new Microsoft.Maps.Map(document.getElementById('mapBody'), {
      credentials: 'Aldes22t6EfUj8rrbjsc6wwjvCTabWgcmCjHLDHw3ffZWrdaeLnRgt6uKPs2kAD5'
    });
  }, 300);

  }

}

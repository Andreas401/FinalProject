import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';


@Injectable({
    providedIn: 'root'
})

export class ApiService {
    constructor(private http: HttpClient) { }
    getAllPoints() {
        return this.http.get('http://localhost:3000/api/getAllPins');
    }

    addPoint(point) {
        return this.http.post('http://localhost:3000/api/addNewPin', point, { responseType: 'text' });
    }
    login(user){
        return this.http.post('http://localhost:3000/api/login', user, { responseType: 'text' });
    }

    deletePin(pinid){
        return this.http.post('http://localhost:3000/api/deletePin', pinid, { responseType: 'text' });
    }

    register(info){
        return this.http.post('http://localhost:3000/api/register', info, { responseType: 'text' });
    }

    getKommuner(){
        return this.http.get('http://localhost:3000/api/getKommuner');
    }

    getLocationByAddress(address){
        return this.http.get('http://dev.virtualearth.net/REST/v1/Locations/DK/'+address+'?maxResults=1&key=Aldes22t6EfUj8rrbjsc6wwjvCTabWgcmCjHLDHw3ffZWrdaeLnRgt6uKPs2kAD5');
    }

    editPoint(epoint){
        return this.http.post('http://localhost:3000/api/editPoint', epoint, { responseType: 'text' });
    }
}

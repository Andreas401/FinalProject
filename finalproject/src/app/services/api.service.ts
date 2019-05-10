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
}

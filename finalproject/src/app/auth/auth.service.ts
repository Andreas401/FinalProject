import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { ApiService } from '../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
  isStudent = false;

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  login(): Observable<boolean> {
    // IRL: Call a ws, authenticate user, save user info or token in auth.service.
    
    return of(true).pipe(
      delay(1000),
      tap(val => {
        this.isLoggedIn = true
        console.log(this.isLoggedIn);
      })
    );
  }

  logout(): void {
    this.isLoggedIn = false;
  }
}
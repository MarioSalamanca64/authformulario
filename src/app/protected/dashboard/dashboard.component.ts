import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
    `
    *{
      margin: 15px;
    }
    `
  ]
})
export class DashboardComponent  {
  //cada que cambia de ususario se mostrara
  get usuario() {
    return this.authServices.usuario;
  }

  constructor( private  router:Router,
               private authServices: AuthService ) { }

  logout(){
    this.router.navigateByUrl('/auth');
    this.authServices.logout();
  }


}

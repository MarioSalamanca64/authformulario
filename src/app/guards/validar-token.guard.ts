import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router, } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ValidarTokenGuard implements CanActivate, CanLoad {
  //llamar el jwt tienemos que inyectarlo
  constructor( private authService: AuthService,
               private router:Router ){}


  canActivate(): Observable<boolean > | boolean  {
    //console.log('canActivate');
    return this.authService.validarToken()
                             .pipe(
                               //efectos secundarios como saber si tienes el jwt o no 
                               //en este caso si no tiene la autentificacion te sacara el en rudado auth
                               tap(valid => {
                                 if(!valid){
                                   this.router.navigateByUrl('/auth');
                                 }
                               })
                             );
  }
  canLoad(): Observable<boolean> | boolean  {
    //console.log('canLoad');
    return this.authService.validarToken()
                            .pipe(
                               tap(valid => {
                                 if(!valid){
                                   this.router.navigateByUrl('/auth');
                                 }
                               })
                             );
  }
}


import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { catchError, map, tap } from'rxjs/operators'

import { environment } from '../../../environments/environment';

import { AuthResponse, Usuario } from '../interface/interfaces';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.baseUrl;
  private _usuario!: Usuario; 

  get usuario(){
    return { ...this._usuario };
  }


  constructor( private http:HttpClient) { }

  registro(name:string, email:string, password: string){
    const url = `${this.baseUrl}/auth/new`;
    const body = {name,email,password};

    return this.http.post<AuthResponse>(url, body)
    //hacemos esto para que trasforme los datos y muestres lo datos en dasborde
    .pipe(
      tap( ({ ok, token }) => {
        if ( ok ) {
          localStorage.setItem('token', token! );
        }
      }),
      map( resp => resp.ok ),
      catchError( err => of(err.error.msg) )
    );


  }


  login( email:string,password:string ){

    const  url = `${this.baseUrl}/auth`;
    const body = {email,password};

     return this.http.post<AuthResponse>(url, body)
                      //hacemos esto para que trasforme los datos y muestres lo datos en dasborde
                      .pipe(
                       tap( resp => {
                         //si la respuesta es correcta
                          if(resp.ok){
                            localStorage.setItem('token', resp.token!)
                           
                          }
                       }),
                      //respuesta o valido //map para traformarlo a bollean
                       map(resp => resp.ok),
                       //aqui trasformam,os el boolean un un subcriber 
                       catchError(err => of(err.error.msg))
                      )

  }

  //hacer tanbien persistente el usuario
  //lo traformamos en boolean para que lo pueda usar el guard
  validarToken(): Observable<boolean> {

    const url = `${ this.baseUrl }/auth/renew`;
    const headers = new HttpHeaders()
      .set('x-token', localStorage.getItem('token') || '' );

    return this.http.get<AuthResponse>( url, { headers } )
        .pipe(
          map( resp => {
            localStorage.setItem('token', resp.token! );
            this._usuario = {
              name: resp.name!,
              udi: resp.uid!,
              email: resp.email!  
            }

            return resp.ok;
          }),
          catchError( err => of(false) )
        );

  }

  logout(){
    localStorage.removeItem('token');
  }


}

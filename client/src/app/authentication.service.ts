import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { map } from 'rxjs/operators'
import { Router } from '@angular/router'

export interface EmployeeDetails {
  _id: string
  first_name: string
  last_name: string
  email: string
  password: string
  exp: number
  iat: number
}

interface TokenResponse {
  token: string
}

export interface TokenPayload {
  _id: string
  first_name: string
  last_name: string
  email: string
  password: string
}
//creamos los metodos para nuestro servicio de autenticación
@Injectable()
export class AuthenticationService {
  private token: string

  constructor(private http: HttpClient, private router: Router) {}

  private saveToken(token: string): void {//obtiene el token del usuario local
    localStorage.setItem('employeetoken', token)//asigna el token del lado del back acá en el front
    this.token = token
  }

  private getToken(): string {
    if (!this.token) {//obtiene el token si no existe
      this.token = localStorage.getItem('employeetoken')
    }
    return this.token//si existe obtiene el token que está local en el front
  }

  public getEmployeeDetails(): EmployeeDetails {
    const token = this.getToken()//obtiene el token en base 64
    let payload
    if (token) {
      payload = token.split('.')[1]//decodifica
      payload = window.atob(payload)
      return JSON.parse(payload)
    } else {
      return null
    }
  }

  public isLoggedIn(): boolean {//verifica si el usuario tiene sesión activa
    const employee = this.getEmployeeDetails()
    if (employee) {
      return employee.exp > Date.now() / 1000
    } else {
      return false
    }
  }

  public register(employee: TokenPayload): Observable<any> {
    const base = this.http.post(`/employees/register`, employee)

    const request = base.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token)
        }
        return data
      })
    )

    return request
  }

  public login(employee: TokenPayload): Observable<any> {
    const base = this.http.post(`/employees/login`, employee)

    const request = base.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token)
        }
        return data
      })
    )

    return request
  }

  public profile(): Observable<any> {
    return this.http.get(`/employees/profile`, {
      headers: { Authorization: ` ${this.getToken()}` }//verifica en el back que tenga el token correcto
    })
  }

  public logout(): void {
    this.token = ''
    window.localStorage.removeItem('employeetoken')
    this.router.navigateByUrl('/')
  }
}

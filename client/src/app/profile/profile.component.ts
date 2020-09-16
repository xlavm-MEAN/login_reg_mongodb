import { Component } from '@angular/core'
import { AuthenticationService, EmployeeDetails } from '../authentication.service'

@Component({
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  details: EmployeeDetails

  constructor(private auth: AuthenticationService) {}

  ngOnInit() {
    this.auth.profile().subscribe(
      employee => {
        this.details = employee
      },
      err => {
        console.error(err)
      }
    )
  }
}

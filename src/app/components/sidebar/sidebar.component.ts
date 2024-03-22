import {
  Component,
  OnInit,
  Inject,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  isAuthenticated: boolean = false;
  userFullName: string = '';

  constructor(
    private elementRef: ElementRef,
    private oktaAuthService: OktaAuthStateService,
    private router: Router,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth
  ) {}

  ngOnInit(): void {
    this.oktaAuthService.authState$.subscribe((result) => {
      this.isAuthenticated = result.isAuthenticated!;
      this.getUserDetails();
    });
  }

  getUserDetails() {
    if (this.isAuthenticated) {
      this.oktaAuth.getUser().then((res) => {
        this.userFullName = res.name as string;
      });
    }
  }

  logout() {
    this.oktaAuth.signOut();
  }

  w3_open() {
    const sidebarElement =
      this.elementRef.nativeElement.querySelector('#mySidebar');
    const openNavElement =
      this.elementRef.nativeElement.querySelector('#openNav');

    sidebarElement.style.width = '23%';
    sidebarElement.style.display = 'block';
    openNavElement.style.display = 'none';
  }

  w3_close() {
    const mainElement = this.elementRef.nativeElement.querySelector('#main');
    const sidebarElement =
      this.elementRef.nativeElement.querySelector('#mySidebar');
    const openNavElement =
      this.elementRef.nativeElement.querySelector('#openNav');

    mainElement.style.marginLeft = '0%';
    sidebarElement.style.display = 'none';
    openNavElement.style.display = 'inline-block';
  }

  createCourse() {
    this.router.navigate([{ outlets: { primary: 'course-form' } }]);
    this.w3_close();
  }

  toCourses() {
    this.router.navigate([{ outlets: { primary: 'courses' } }]);
    this.w3_close();
  }

  toProfile() {
    this.router.navigate([{ outlets: { primary: 'profile' } }]);
    this.w3_close();
  }

}

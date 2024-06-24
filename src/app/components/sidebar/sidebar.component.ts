import { identifierName } from '@angular/compiler';
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
import { User } from 'src/app/common/user';
import { ManagersService } from 'src/app/services/managers.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  isAuthenticated: boolean = false;
  userFullName: string = '';
  isManager: boolean = false;
  email: string = '';
  profilePicture: string = "../../../assets/images/profile-picture.png";
  loading:boolean = false;

  constructor(
    private elementRef: ElementRef,
    private oktaAuthService: OktaAuthStateService,
    private router: Router,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
    private managersService: ManagersService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.oktaAuthService.authState$.subscribe((result) => {
      this.isAuthenticated = result.isAuthenticated!;
      this.getUserDetails();
    });
  }

  getUserDetails() {
    if (this.isAuthenticated) {
      this.oktaAuth.getUser().then((user) => {
        if (user.email !== undefined) {
          this.userFullName = user.name as string;
          this.email = user.email;
          this.checkIfManager();
          sessionStorage.setItem('email', this.email);
          sessionStorage.setItem('userFullName', this.userFullName);
          this.userService.getUser(this.email).subscribe((data) => {
            
            if (data == null) {

              let newUser = new User(this.email, this.userFullName, '');
              this.userService
                .addUser(newUser)
                .subscribe((data) => console.log(data));
            } else {
              if(data.profielPicureUrl !== ''){                
                this.profilePicture = data.profilePictureUrl;
              }
              
            }
            sessionStorage.setItem("profilePictureUrl",this.profilePicture);
          });
        }
      });
    }
  }

  checkIfManager() {
    this.managersService.getManagers().subscribe(
      (data) => {
        for (let i = 0; i < data.length && !this.isManager; i++) {
          if (this.email === data[i].profile.email) {
            this.isManager = true;
          }
        }
        sessionStorage.setItem('isManager', JSON.stringify(this.isManager));
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  logout() {
    Swal.fire({
      title: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes"
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.w3_close();
        this.oktaAuth.signOut();
      }
    });
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
    this.router.navigate([{ outlets: { primary: 'user-profile' } }]);
    this.w3_close();
  }

  toRecommendedCourses(){
    
    this.router.navigate([{ outlets: { primary: 'recommended-courses' } }]);
    this.w3_close();
  }
}

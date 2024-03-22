import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Course } from '../common/course';

@Injectable({
  providedIn: 'root'
})
export class CourseTransferService {
  private objectSource = new BehaviorSubject<Course>(new Course());
  currentObject = this.objectSource.asObservable();

  constructor() { }

  transferObject(course: Course){
    this.objectSource.next(course);
  }
}

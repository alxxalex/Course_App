import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { JobTitle } from 'src/app/common/job-title';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-job-input',
  templateUrl: './job-input.component.html',
  styleUrls: ['./job-input.component.css']
})
export class JobInputComponent {

  separatorKeysCodes: number[] = [ENTER, COMMA];
  jobCtrl = new FormControl('');
  filteredJobs: Observable<string[]>;
  jobs: string[] = [];
  allJobs: string[] = Object.values(JobTitle);

  @ViewChild('jobInput') jobInput!: ElementRef<HTMLInputElement>;
  @Output() jobsChange = new EventEmitter<string[]>(); 


  constructor() {
    this.filteredJobs = this.jobCtrl.valueChanges.pipe(
      startWith(null),
      map((job: string | null) => (job ? this._filter(job) : this.allJobs.slice())),
    );
  }

  // add(event: MatChipInputEvent): void {
  //   const value = (event.value || '').trim();

  //   // Add your job
  //   if (value) {
  //     this.jobs.push(value);
  //     console.log(this.jobs);
      
  //   }

  //   // Clear the input value
  //   event.chipInput!.clear();

  //   this.jobCtrl.setValue(null);
  // }

  remove(job: string): void {
    const index = this.jobs.indexOf(job);

    if (index >= 0) {
      this.jobs.splice(index, 1);
      this.jobsChange.emit(this.jobs);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if(!this.jobs.includes(event.option.viewValue)){
    this.jobs.push(event.option.viewValue);
    this.jobsChange.emit(this.jobs);
    }else
    {
      Swal.fire({
        icon: "error",
        title: "Your already add this job",
        showConfirmButton: false,
        timer: 1000
      });
    }
    this.jobInput.nativeElement.value = '';
    this.jobCtrl.setValue(null);
    
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allJobs.filter(job => job.toLowerCase().includes(filterValue));
  }
}

import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { ClassificationService } from '../../services/classification.service';
import { ToastComponent } from '../../shared/toast/toast.component';

@Component({
  selector: 'app-classification',
  templateUrl: './Classification.component.html',
  styleUrls: ['./Classification.component.scss']
})
export class ClassificationComponent implements OnInit {

  currentClassification: any = {};
  currentClassificationIndex: number;
  classifications = [];
  isLoading = true;
  isEditing = false;

  addClassificationsForm: FormGroup;
  name = new FormControl('', Validators.required);

  constructor(private ClassificationService: ClassificationService,
              private formBuilder: FormBuilder,
              private http: Http,
              public toast: ToastComponent) { }

  ngOnInit() {
    this.getClassifications();
    this.addClassificationsForm = this.formBuilder.group({
      name: this.name,
    });
  }

  getClassifications() {
    this.ClassificationService.getClassifications().subscribe(
      data => {
        if (data != null) {
          this.classifications = data.sort((a, b) => a.order > b.order ? -1 : 1);
        }
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  addClassification(modal) {
    this.isEditing = true;
    this.currentClassification = {};
    this.currentClassificationIndex = this.classifications.length;
    modal.open();
  }

  enableEditing(Classification, ind, modal) {
    this.isEditing = true;
    this.currentClassification = JSON.parse(JSON.stringify(Classification));
    this.currentClassificationIndex = ind;
    modal.open();
  }

  doneEditClassification(Classification) {
     if (this.classifications.length === this.currentClassificationIndex) {
        this.ClassificationService.addClassification(Classification).subscribe(
        res => {
          this.isEditing = false;
          this.classifications.push(Classification);
          this.toast.setMessage(Classification.id + ' עודכן בהצלחה', 'success');
        },
        error => console.log(error)
      );
    } else {
      this.ClassificationService.editClassification(Classification).subscribe(
        res => {
          this.isEditing = false;
          this.classifications[this.currentClassificationIndex] = Classification;
          this.toast.setMessage('עודכן בהצלחה', 'success');
        },
        error => console.log(error)
      );
    }
  }

}

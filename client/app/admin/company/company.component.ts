import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { CompanyService } from '../../services/company.service';
import { ToastComponent } from '../../shared/toast/toast.component';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

  currentCompany: any = {};
  currentCompanyIndex: number;
  companies = [];
  isLoading = true;
  isEditing = false;

  addCompaniesForm: FormGroup;
  name = new FormControl('', Validators.required);

  constructor(private CompanyService: CompanyService,
              private formBuilder: FormBuilder,
              private http: Http,
              public toast: ToastComponent) { }

  ngOnInit() {
    this.getCompanies();
    this.addCompaniesForm = this.formBuilder.group({
      name: this.name,
    });
  }

  getCompanies() {
    this.CompanyService.getCompanies().subscribe(
      data => {
        if (data != null) {
          this.companies = data;
        }
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  addCompany(modal) {
    this.isEditing = true;
    this.currentCompany = {};
    this.currentCompanyIndex = this.companies.length;
    modal.open();
  }

  enableEditing(Company, ind, modal) {
    this.isEditing = true;
    this.currentCompany = JSON.parse(JSON.stringify(Company));
    this.currentCompanyIndex = ind;
    modal.open();
  }

  doneEditCompany(company) {
     if (this.companies.length === this.currentCompanyIndex) {
        this.CompanyService.addCompany(company).subscribe(
        res => {
          this.isEditing = false;
          this.companies.push(company);
          this.toast.setMessage(company.id + ' עודכן בהצלחה', 'success');
        },
        error => console.log(error)
      );
    } else {
      this.CompanyService.editCompany(company).subscribe(
        res => {
          this.isEditing = false;
          this.companies[this.currentCompanyIndex] = company;
          this.toast.setMessage('עודכן בהצלחה', 'success');
        },
        error => console.log(error)
      );
    }
  }

  handleInputChange(e) {
    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    const pattern = /image-*/;
    const reader = new FileReader();

    if (!file.type.match(pattern)) {
        alert('invalid format');
        return;
    }

    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e) {
      const reader = e.target;
      this.currentCompany.image = reader.result;
  }

}

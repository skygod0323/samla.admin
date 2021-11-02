import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Validate } from 'app/services/validate.service';
import { Api } from 'app/services/api.service';
import { Notifications } from 'app/services/notifications.service';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
})
export class UserCreateComponent implements OnInit, AfterViewInit {

  public form: FormGroup

  constructor(
    public validate: Validate,
    public api: Api,
    public notify: Notifications,
    public formBuilder: FormBuilder,
    public router: Router
  ) {

  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: [null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      password: ['', Validators.required],
    });
  }

  ngAfterViewInit() {

  }

  createUser() {
    if (this.form.valid) {
      this.notify.showLoading();

      this.api.createAdminUser(this.form.value).subscribe(res => {

        this.notify.hideLoading();

        if (res.success) {

          this.notify.showNotification('successfully created', 'top', 'center', 'success');

          this.router.navigate(['/user-management']);

        } else {
          this.notify.showNotification(res.error, 'top', 'center', 'warning');
        }
      }, err => {
        this.notify.hideLoading();
        this.notify.showNotification('Error', 'top', 'center', 'danger');
      });
    } else {
      this.validate.validateAllFormFields(this.form);
    }
  }

  cancel() {
    this.router.navigate(['/user-management']);
  }

}
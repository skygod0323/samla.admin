import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validate } from 'app/services/validate.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Api } from 'app/services/api.service';
import { Notifications } from 'app/services/notifications.service';

declare var swal: any;

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html'
})
export class UserEditComponent implements OnInit, AfterViewInit {

  public userId;
  public sub: any;
  public form: FormGroup;

  public changePassword = true;

  constructor(
    public validate: Validate,
    public api: Api,
    public notify: Notifications,
    public formBuilder: FormBuilder,
    public router: Router,
    public activateRoute: ActivatedRoute
  ) {

  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: [null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      password: ['**********', Validators.required],
      changePassword: [false],

    });

    // this.form.valueChanges.subscribe(() => {
    //   console.log('change');
    //   if (this.form.controls['changePassword'].value) {
    //     this.form.controls['password'].setValue('');
    //   } else {
    //     this.form.controls['password'].setValue('**********');
    //   }
    // });

    this.sub = this.activateRoute.params.subscribe(params => {
      if (params.userId) {
        this.userId = params.userId;
        console.log(this.userId);

        this.loadAdminUser();
      } else {
        console.log('all');
      }
    });
  }

  changePasswordStatus() {
    if (this.form.controls['changePassword'].value) {
      this.form.controls['password'].setValue('');
    } else {
      this.form.controls['password'].setValue('**********');
    }

    console.log(this.form.value);
  }

  loadAdminUser() {
    this.api.getAdminUser(this.userId).subscribe(res => {

      this.notify.hideLoading();

      if (res.success) {

        if (res.data) {
          this.form.controls['firstname'].setValue(res.data.firstname);
          this.form.controls['lastname'].setValue(res.data.lastname);
          this.form.controls['email'].setValue(res.data.email);
          //this.form.controls['firstname'].setValue(res.data.firstname);
        }

      } else {
        this.notify.showNotification(res.error, 'top', 'center', 'warning');
      }
    }, err => {
      this.notify.hideLoading();
      this.notify.showNotification('Error', 'top', 'center', 'danger');
    });
  }

  ngAfterViewInit() {

  }

  Update() {
    if (this.form.valid) {

      var _this = this;
      swal({
        title: 'Are you sure?',
        text: 'You will not be able to revert this!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        confirmButtonText: 'Yes, update it!',
        buttonsStyling: false
      }).then(function () {

        _this.notify.showLoading();


        _this.api.updateAdminUser({
          ..._this.form.value,
          id: _this.userId
        }).subscribe(res => {

          _this.notify.hideLoading();

          if (res.success) {

            _this.notify.showNotification('successfully updated', 'top', 'center', 'success');

            // swal({
            //   title: 'Updated!',
            //   text: 'You successfully updated this admin user.',
            //   type: 'success',
            //   confirmButtonClass: 'btn btn-success',
            //   buttonsStyling: false
            // });

            _this.router.navigate(['/user-management']);

          } else {
            _this.notify.showNotification(res.error, 'top', 'center', 'warning');
          }
        }, err => {
          _this.notify.hideLoading();
          _this.notify.showNotification('Error', 'top', 'center', 'danger');
        });
      });

    } else {
      this.validate.validateAllFormFields(this.form);
    }

  }

  cancel() {
    this.router.navigate(['/user-management']);
  }

}
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from 'app/services/api.service';
import { Notifications } from 'app/services/notifications.service';

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, AfterViewInit {

  public userList = [];

  constructor(
    private router: Router,
    private api: Api,
    private notify: Notifications
  ) {

  }


  ngOnInit() {

    this.notify.showLoading();

    this.api.getAdminList().subscribe(res => {

      this.notify.hideLoading();

      if (res.success) {
        this.userList = res.data;
      } else {
        this.notify.showNotification('Error', 'top', 'center', 'warning');
      }
    }, err => {
      this.notify.hideLoading();
      this.notify.showNotification('Error', 'top', 'center', 'danger');
    });
  }

  ngAfterViewInit() {

  }

  favorite(index) {
    console.log('test' + index);
  }

  edit(id) {
    this.router.navigate(['/user-management/edit/' + id]);
  }

  createUser() {
    this.router.navigate(['/user-management/create']);
  }

  deleteUser(index) {

    var _this = this;
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Yes, delete it!',
      buttonsStyling: false
    }).then(function () {

      _this.notify.showLoading();

      _this.api.deleteAdminUser(_this.userList[index].id).subscribe(res => {

        _this.notify.hideLoading();

        _this.notify.showNotification('successfully deleted', 'top', 'center', 'success');

        _this.userList.splice(index, 1);
      }, err => {
        _this.notify.hideLoading();
        _this.notify.showNotification('Error', 'top', 'center', 'danger');
      });

    });
  }

}
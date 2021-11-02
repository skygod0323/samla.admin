import { Component, OnInit, AfterViewInit } from '@angular/core';

import { Api } from 'app/services/api.service';
import { Notifications } from 'app/services/notifications.service';
import { Router } from '@angular/router';

declare const $: any;
declare var swal: any;

declare interface TableData {
  headerRow: string[];
  dataRows: string[][];
}

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.scss']
})
export class ImageListComponent implements OnInit, AfterViewInit {

  loading = false;
  public imageList = [];
  public filteredImageList = [];
  public searchKey = '';

  constructor(
    private api: Api,
    private notify: Notifications,
    private router: Router
  ) {

  }

  ngOnInit() {

    this.loadImageList();
  }

  ngAfterViewInit() {

  }

  uploadImage() {
    this.router.navigate(['/upload-management/upload-image']);
  }

  loadImageList() {

    this.notify.showLoading();
    this.loading = true;

    this.api.getImageList().subscribe(res => {

      this.notify.hideLoading();
      this.loading = false;

      if (res.success) {
        this.imageList = res.data;

        this.filter();
      } else {
        this.notify.showNotification('Error', 'top', 'center', 'warning');
      }
    }, err => {
      this.notify.hideLoading();
      this.loading = false;
      this.notify.showNotification('Error', 'top', 'center', 'danger');
    });
  }

  getCategoryString(categories) {
    var str = "";
    categories.forEach(element => {
      str += element.name + ", ";
    });
    str = str.substr(0, str.length - 2);
    return str.length > 20 ? str.substr(0, 30) + "..." : str;
  }



  deleteImage(index) {
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

      _this.api.deleteImage(_this.filteredImageList[index].id).subscribe(res => {

        _this.notify.hideLoading();

        _this.notify.showNotification('successfully deleted', 'top', 'center', 'success');

        // _this.loadImageList();

        console.log(_this.imageList.length);
        _this.filteredImageList.splice(index, 1);

        console.log(_this.imageList.length);
      }, err => {
        _this.notify.hideLoading();
        _this.notify.showNotification('Error', 'top', 'center', 'danger');
      });

    });
  }

  newImages() {
    this.router.navigate(['/upload-management/upload-image']);
  }

  editImage(id) {
    this.router.navigate(['/upload-management/edit-image/' + id]);
  }

  filter() {
    var query = this.searchKey.toLowerCase();
    if (this.searchKey == '') {
      this.filteredImageList = this.imageList;
      return;
    }

    this.filteredImageList = this.imageList.filter(item => {
      if (item['title'].toLowerCase().indexOf(query) > -1) return true;
      if (item['name'].toLowerCase().indexOf(query) > -1) return true;

      if (item['city']) {
        if (item['city'].toLowerCase().indexOf(query) > -1) return true;
      }

      if (item['country']) {
        if (item['country'].toLowerCase().indexOf(query) > -1) return true;
      }

      for (var i = 0; i < item.categories.length; i++) {
        if (item.categories[i]['name'].toLowerCase().indexOf(query) > -1) return true;
      }

      for (var i = 0; i < item.modelreleases.length; i++) {
        if (item.modelreleases[i]['name'].toLowerCase().indexOf(query) > -1) return true;
      }

      for (var i = 0; i < item.tags.length; i++) {
        if (item.tags[i].toLowerCase().indexOf(query) > -1) return true;
      }
    });

    return false;
  }

  getModelReleaseString(modelReleases) {
    var str = "";
    modelReleases.forEach(element => {
      str += element.name + ", ";
    });
    str = str.substr(0, str.length - 2);
    return str.length > 20 ? str.substr(0, 30) + "..." : str;
  }
}
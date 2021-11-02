import { Component, OnInit, AfterViewInit } from '@angular/core';

import * as Chartist from 'chartist';
import { Api } from 'app/services/api.service';
import { Notifications } from 'app/services/notifications.service';
import { MatDialog } from '@angular/material';
import { CategoryModalComponent } from 'app/shared/components/modals/category-modal/category-modal.component';

declare const $: any;

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit, AfterViewInit {

  loading = false;
  categoryList = [];

  constructor(
    private api: Api,
    private notify: Notifications,
    public dialog: MatDialog,
  ) {

  }

  ngOnInit() {
    this.loadCategoryList();
  }

  ngAfterViewInit() {

  }

  loadCategoryList() {
    this.notify.showLoading();
    this.loading = true;

    this.api.getCategoryList().subscribe(res => {

      this.notify.hideLoading();
      this.loading = false;

      if (res.success) {
        this.categoryList = res.data;
      } else {
        this.notify.showNotification('Error', 'top', 'center', 'warning');
      }
    }, err => {
      this.notify.hideLoading();
      this.loading = false;
      this.notify.showNotification('Error', 'top', 'center', 'danger');
    });
  }

  createCategory() {
    let dialogRef = this.dialog.open(CategoryModalComponent, {
      disableClose: true,
      width: '600px',
      data: {
        mode: 'create'
      }
    });

    dialogRef.afterClosed().subscribe(modal_res => {
      if (modal_res.type == 'apply') {
        this.notify.showLoading();

        this.api.createCategory(modal_res.data).subscribe(res => {

          this.notify.hideLoading();

          if (res.success) {

            this.notify.showNotification('successfully created', 'top', 'center', 'success');
            this.loadCategoryList();

          } else {
            this.notify.showNotification(res.error, 'top', 'center', 'warning');
          }
        }, err => {
          this.notify.hideLoading();
          this.notify.showNotification('Error', 'top', 'center', 'danger');
        });
      }
    })
  }

  editCategory(index) {
    let dialogRef = this.dialog.open(CategoryModalComponent, {
      disableClose: true,
      width: '600px',
      data: {
        mode: 'edit',
        category: this.categoryList[index]
      }
    });

    dialogRef.afterClosed().subscribe(modal_res => {
      if (modal_res.type == 'apply') {
        this.notify.showLoading();

        this.api.updateCategory({
          id: this.categoryList[index].id,
          ...modal_res.data
        }).subscribe(res => {

          this.notify.hideLoading();

          if (res.success) {

            this.notify.showNotification('successfully updated', 'top', 'center', 'success');
            this.loadCategoryList();

          } else {
            this.notify.showNotification(res.error, 'top', 'center', 'warning');
          }
        }, err => {
          this.notify.hideLoading();
          this.notify.showNotification('Error', 'top', 'center', 'danger');
        });
      }
    })
  }

}
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Api } from 'app/services/api.service';
import { Notifications } from 'app/services/notifications.service';
import { MatDialog } from '@angular/material';
import { ModelReleaseModalComponent } from 'app/shared/components/modals/modelrelease-modal/modelrelease-modal.component';


declare const $: any;

@Component({
  selector: 'app-modelrelease-list',
  templateUrl: './modelrelease-list.component.html',
  styleUrls: ['./modelrelease-list.component.scss']
})
export class ModelreleaseListComponent implements OnInit, AfterViewInit {

  loading = false;
  modelReleaseList = [];

  constructor(
    private api: Api,
    private notify: Notifications,
    public dialog: MatDialog,
  ) {

  }

  ngOnInit() {
    this.loadModelReleaseList();
  }

  ngAfterViewInit() {

  }

  newModelRelease() {
    let dialogRef = this.dialog.open(ModelReleaseModalComponent, {
      disableClose: true,
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(modal_res => {
      if (modal_res.type == 'apply') {
        this.notify.showLoading();

        this.api.createModelRelease(modal_res.data).subscribe(res => {

          this.notify.hideLoading();

          if (res.success) {

            this.notify.showNotification('successfully created', 'top', 'center', 'success');
            this.loadModelReleaseList();

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

  loadModelReleaseList() {
    this.notify.showLoading();
    this.loading = true;

    this.api.getModelReleaseList().subscribe(res => {

      this.notify.hideLoading();
      this.loading = false;

      if (res.success) {
        this.modelReleaseList = res.data;
      } else {
        this.notify.showNotification('Error', 'top', 'center', 'warning');
      }
    }, err => {
      this.notify.hideLoading();
      this.loading = false;
      this.notify.showNotification('Error', 'top', 'center', 'danger');
    });
  }
}
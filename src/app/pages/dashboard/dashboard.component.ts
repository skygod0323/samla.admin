import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TableData } from '../../md/md-table/md-table.component';
import { LegendItem, ChartType } from '../../md/md-chart/md-chart.component';

import * as Chartist from 'chartist';
import { Api } from 'app/services/api.service';
import { Notifications } from 'app/services/notifications.service';
import { Router } from '@angular/router';

declare const $: any;

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

    isLoaded = false;
    info = {}

    constructor(
        public api: Api,
        public notify: Notifications,
        public router: Router,

    ) {

    }
    public tableData: TableData;

    // constructor(private navbarTitleService: NavbarTitleService) { }
    public ngOnInit() {
        this.tableData = {
            headerRow: ['ID', 'Name', 'Salary', 'Country', 'City'],
            dataRows: [
                ['US', 'USA', '2.920	', '53.23%'],
                ['DE', 'Germany', '1.300', '20.43%'],
                ['AU', 'Australia', '760', '10.35%'],
                ['GB', 'United Kingdom	', '690', '7.87%'],
                ['RO', 'Romania', '600', '5.94%'],
                ['BR', 'Brasil', '550', '4.34%']
            ]
        };


        this.loadDahsobardInfo();
    }
    ngAfterViewInit() {

    }

    loadDahsobardInfo() {
        this.isLoaded = false;
        this.notify.showLoading();
        this.api.getDahsobardInfo().subscribe(res => {
            this.notify.hideLoading();
            if (res.success) {
                this.isLoaded = true;
                this.info = res.data;
            }
        }, err => {
            this.notify.showNotification('Error', 'top', 'center', 'danger');
        })
    }

    goToUpload() {
        this.router.navigate(['/upload-management/upload-image']);
    }
}

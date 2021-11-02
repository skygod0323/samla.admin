import { Component, OnInit } from '@angular/core';
import PerfectScrollbar from 'perfect-scrollbar';
import { SettingsService } from "../services/settings/settings.service";
import { Router } from "@angular/router";

declare const $: any;

//Metadata
export interface RouteInfo {
    path: string;
    title: string;
    type: string;
    icontype: string;
    permission: string;
    collapse?: string;
    children?: ChildrenItems[];
}

export interface ChildrenItems {
    path: string;
    title: string;
    ab: string;
    type?: string;
}

//Menu Items
export const ROUTES: RouteInfo[] = [
    {
        path: '/dashboard',
        title: 'Dashboard',
        type: 'link',
        icontype: 'dashboard',
        permission: 'all'
    }, {
        path: '/user-management',
        title: 'User Management',
        type: 'link',
        icontype: 'group',
        permission: 'superadmin'
    }, {
        path: '/upload-management',
        title: 'Upload Mangement',
        type: 'sub',
        icontype: 'assignment',
        collapse: 'upload-mangement',
        permission: 'all',
        children: [
            { path: 'category-list', title: 'Category List', ab: 'CL' },
            { path: 'modelrelease-list', title: 'Model Release List', ab: 'MR' },
            { path: 'image-list', title: 'Image List', ab: 'IL' },
            { path: 'upload-image', title: 'Upload Image', ab: 'UI' },
        ]
    }
];

@Component({
    selector: 'app-sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    public fullname: any;

    constructor(
        public settings: SettingsService,
        private router: Router
    ) {
    }

    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    };

    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => {
            if (menuItem.permission == 'all') return true;
            if (menuItem.permission == 'superadmin' && this.settings.getUserSetting('role') == 'superadmin') return true;
            return false;
        });
        this.fullname = this.settings.getUserSetting('firstname') + ' ' + this.settings.getUserSetting('lastname');
    }

    updatePS(): void {
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
            let ps = new PerfectScrollbar(elemSidebar, { wheelSpeed: 2, suppressScrollX: true });
        }
    }

    isMac(): boolean {
        let bool = false;
        if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
            bool = true;
        }
        return bool;
    }

    onLogout() {
        this.settings.setAppSetting('is_loggedin', false);
        this.settings.user = {};
        this.settings.setStorage('token', false);

        this.router.navigate(['/login']);
    }
}

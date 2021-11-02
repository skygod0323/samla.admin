/**
 * Created by ApolloYr on 11/17/2017.
 */

import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { SettingsService } from './settings/settings.service';
import { Router } from '@angular/router';
import { Notifications } from './notifications.service';

@Injectable()
export class Api {
    constructor(
        private http: Http,
        private router: Router,
        public settings: SettingsService,
        public notify: Notifications
    ) {
    }

    createAuthorizationHeader(headers: Headers) {
        headers.append('Authorization', 'Bearer ' + this.settings.getStorage('token'));
    }

    get(url, data?) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);

        const params: URLSearchParams = new URLSearchParams();
        if (data) {
            for (var key in data) {
                params.set(key, data[key]);
            }
        }

        return this.http.get(this.settings.apiUrl + url, {
            headers: headers,
            search: params
        }).map(res => res.json()).catch(this.handleError);
    }

    post(url, data) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);

        return this.http.post(this.settings.apiUrl + url, data, {
            headers: headers
        }).map(res => res.json()).catch(this.handleError);
    }

    put(url, data) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);

        return this.http.put(this.settings.apiUrl + url, data, {
            headers: headers
        }).map(res => res.json()).catch(this.handleError);
    }

    private handleError(error: any) {
        console.log(error);
        if ((error.status == 401 || error.status == 400) && error.url && !error.url.endsWith('/login')) {
            console.log('unauthorized');
            if (this.settings) this.settings.setStorage('token', false);
            if (this.settings) this.settings.setAppSetting('is_loggedin', false);
            this.notify.showNotification('Token expired. Please login again', 'top', 'center', 'danger');
            this.router.navigate(['/login']);
        }
        // In a real world app, you might use a remote logging infrastructure

        return Observable.throw(error);
    }


    /// auth services

    getAccountInfo() {
        return this.get('/account/getAccount');
    }

    login(data): any {
        return this.post('/user/login', data);
    }

    register(data): any {
        return this.post('/register', data);
    }



    //// user management

    createAdminUser(data): any {
        return this.post('/user/createAdminUser', data);
    }

    updateAdminUser(data): any {
        return this.post('/user/updateAdminUser', data);
    }

    deleteAdminUser(id): any {
        return this.post('/user/deleteAdminUser', { id: id });
    }

    getAdminList(): any {
        return this.get('/user/getAdminList');
    }

    getAdminUser(id): any {
        return this.get('/user/getAdminUser', { id: id });
    }

    //// upload management

    getCategoryList() {
        return this.get('/uploadmanagement/getCategoryList');
    }

    getImageList() {
        return this.get('/uploadmanagement/getImageList');
    }

    getImage(id) {
        return this.get('/uploadmanagement/getImage', { id: id });
    }

    getModelReleaseList() {
        return this.get('/uploadmanagement/getModelReleaseList');
    }

    createCategory(data) {
        return this.post('/uploadmanagement/createCategory', data);
    }

    updateCategory(data) {
        return this.post('/uploadmanagement/updateCategory', data);
    }

    createImage(data) {
        return this.post('/uploadmanagement/createImage', data);
    }

    deleteImage(id): any {
        return this.post('/uploadmanagement/deleteImage', { id: id });
    }

    updateImage(data): any {
        return this.post('/uploadmanagement/updateImage', data);
    }

    createModelRelease(data) {
        return this.post('/uploadmanagement/createModelRelease', data);
    }



    //// dashboard
    getDahsobardInfo() {
        return this.get('/dashboard/getDahsobardInfo');
    }
}


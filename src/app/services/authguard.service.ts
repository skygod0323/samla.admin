/**
 * Created by ApolloYr on 11/17/2017.
 */
import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { SettingsService } from './settings/settings.service';
import { Api } from './api.service';

@Injectable()
export class AuthGuard implements Resolve<any> {

    constructor(private router: Router,
        private settings: SettingsService,
        private api: Api,
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log(this.settings.user);
            if (this.settings.getAppSetting('is_loggedin')) {
                console.log(true);
                resolve(true);
            } else if (this.settings.getStorage('token')) {
                this.api.getAccountInfo().subscribe(res => {
                    this.settings.setAppSetting('is_loggedin', true);
                    this.settings.user = res.data;

                    resolve(true);
                }, err => {
                    reject('information is invalid');
                    this.settings.setStorage('token', false);
                    this.router.navigate(['/login']);
                });
            } else {
                reject('not logged in');
                this.router.navigate(['/login']);
            }
        });
    }
}


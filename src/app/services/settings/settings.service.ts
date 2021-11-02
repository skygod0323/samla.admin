/**
 * Created by ApolloYr on 11/17/2017.
 */
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable()
export class SettingsService {
    public siteUrl = environment.server;
    public apiUrl = environment.server + '/api';

    public user: any;
    public app: any;
    public layout: any;

    private storagePrefix = 'samla_';
    public loading = false;

    constructor(
    ) {
        // User settings
        this.user = {};

        // App Settings
        this.app = {
            name: 'Samla'
        };
    }

    getUserSetting(name) {
        return name ? this.user[name] : this.user;
    }

    setUserSetting(name, value) {
        this.user[name] = value;
    }

    getAppSetting(name) {
        return name ? this.app[name] : this.app;
    }

    setAppSetting(name, value) {
        if (typeof this.app[name] !== 'undefined') {
            this.app[name] = value;
        }
    }

    clearUserSetting() {
        this.setStorage('user', false);
    }

    getStorage(key, defaultVal?) {
        return window.localStorage[this.storagePrefix + key] ?
            JSON.parse(window.localStorage[this.storagePrefix + key]) : defaultVal || false;
    };

    setStorage(key, val) {
        window.localStorage.setItem(this.storagePrefix + key, JSON.stringify(val));
    }
}


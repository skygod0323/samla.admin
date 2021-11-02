/**
 * Created by ApolloYr on 11/18/2017.
 */

import { Injectable } from '@angular/core';
import { SettingsService } from './settings/settings.service';

declare const $: any;

@Injectable()
export class Notifications {
    constructor(
        public setting: SettingsService
    ) {

    }
    showNotification(message: any, from: any, align: any, type: any) {
        // const type = ['', 'info', 'success', 'warning', 'danger', 'rose', 'primary'];

        const color = Math.floor((Math.random() * 6) + 1);

        $.notify({
            icon: 'notifications',
            message: message
        }, {
                type: type,
                timer: 1000,
                placement: {
                    from: from,
                    align: align
                }
            });
    }

    showLoading() {
        this.setting.loading = true;
    }

    hideLoading() {
        this.setting.loading = false;
    }
}

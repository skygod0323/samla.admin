import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Notifications } from "../services/notifications.service";
import { Api } from "../services/api.service";
import { Router } from "@angular/router";
import { SettingsService } from "../services/settings/settings.service";
import { Validate } from "../services/validate.service";

declare var $: any;

@Component({
    selector: 'app-login-cmp',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
    login: FormGroup;
    user: any = {};
    res: any = {};

    constructor(
        private element: ElementRef,
        private formBuilder: FormBuilder,
        public api: Api,
        public notify: Notifications,
        public router: Router,
        public settings: SettingsService,
        public validate: Validate
    ) {
    }

    ngOnInit() {
        setTimeout(function () {
            // after 1000 ms we add the class animated to the login/register card
            $('.card').removeClass('card-hidden');
        }, 700);

        this.login = this.formBuilder.group({
            email: [null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
            password: ['', Validators.required],
        });
    }

    successLogin() {
        this.settings.user = this.res.data;
        this.settings.setStorage('token', this.res.token);
        this.settings.setAppSetting('is_loggedin', true);

        this.router.navigate(['/dashboard']);
    }

    onLogin() {
        if (this.login.valid) {
            this.notify.showLoading();
            this.api.login(this.user).subscribe(res => {

                this.notify.hideLoading();

                if (res.success) {
                    this.res = res;
                    this.successLogin();
                } else {
                    this.notify.showNotification(res.error, 'top', 'center', 'warning');
                }
            }, err => {
                this.notify.hideLoading();
                this.notify.showNotification('Error', 'top', 'center', 'danger');
            });
        } else {
            this.validate.validateAllFormFields(this.login);
        }
    }
}

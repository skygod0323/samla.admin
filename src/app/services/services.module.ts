/**
 * Created by ApolloYr on 11/18/2017.
 */

import { NgModule } from '@angular/core';
import { SettingsService } from "./settings/settings.service";
import { SecureHttpService } from "./securehttp.service";
import { Api } from "./api.service";
import { AuthGuard } from "./authguard.service";
import { Notifications } from "./notifications.service";
import { Validate } from "./validate.service";

@NgModule({
    imports: [],
    declarations: [],
    providers: [
        SettingsService,
        SecureHttpService,
        Api,
        AuthGuard,
        Notifications,
        Validate,
    ],
    exports: []
})
export class ServicesModule {
}

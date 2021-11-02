import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FooterModule } from "./footer/footer.module";
import { NavbarModule } from "./navbar/navbar.module";
import { FieldErrorDisplayComponent } from "./components/field-error-display/field-error-display.component";
import { MaterialModule } from 'app/app.module';
import { CategoryModalComponent } from './components/modals/category-modal/category-modal.component';
import { ModelReleaseModalComponent } from './components/modals/modelrelease-modal/modelrelease-modal.component';

@NgModule({
    imports: [
        CommonModule,
        FooterModule,
        NavbarModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    exports: [
        FooterModule,
        NavbarModule,
        FormsModule,
        ReactiveFormsModule,
        FieldErrorDisplayComponent,
        CategoryModalComponent
    ],
    declarations: [
        FieldErrorDisplayComponent,
        CategoryModalComponent,
        ModelReleaseModalComponent
    ],
    entryComponents: [
        CategoryModalComponent,
        ModelReleaseModalComponent
    ]
})

// https://github.com/ocombe/ng2-translate/issues/209
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule
        };
    }
}

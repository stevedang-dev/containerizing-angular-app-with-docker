import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import {
    APP_MODULE_DECLARATIONS,
    APP_MODULE_IMPORTS
} from './app-dependencies.module';

@NgModule({
    declarations: [
        AppComponent,
        ...APP_MODULE_DECLARATIONS,
        AppRoutingModule.Components
    ],
    imports: [BrowserModule, AppRoutingModule, ...APP_MODULE_IMPORTS],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}

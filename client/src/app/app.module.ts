import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AppRoutingModule} from "./app-routing.module";
import {CommonModule} from "@angular/common";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";

import {AppComponent} from './app.component';
import {AuthLayoutComponent} from './auth-layout/auth-layout.component';
import {SiteLayoutComponent} from './site-layout/site-layout.component';
import {LoginPageComponent} from './auth-layout/login-page/login-page.component';
import {RegisterPageComponent} from './auth-layout/register-page/register-page.component';
import {TokenInterceptor} from "./shared/classes/token.interceptor";
import {OverviewPageComponent} from './site-layout/overview-page/overview-page.component';
import {AnalyticsPageComponent} from './site-layout/analytics-page/analytics-page.component';
import {HistoryPageComponent} from './site-layout/history-page/history-page.component';
import {OrderPageComponent} from './site-layout/order-page/order-page.component';
import {CategoriesPageComponent} from './site-layout/categories-page/categories-page.component';
import {LoaderComponent} from './shared/components/loader/loader.component';
import {CategoriesFormComponent} from './site-layout/categories-page/categories-form/categories-form.component';
import {PositionsFormComponent} from './site-layout/categories-page/categories-form/positions-form/positions-form.component';
import {OrderCategoriesComponent} from './site-layout/order-page/order-categories/order-categories.component';
import {OrderPositionsComponent} from './site-layout/order-page/order-positions/order-positions.component';
import { HistoryListComponent } from './site-layout/history-page/history-list/history-list.component';
import { HistoryFilterComponent } from './site-layout/history-page/history-filter/history-filter.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    AuthLayoutComponent,
    SiteLayoutComponent,
    RegisterPageComponent,
    OverviewPageComponent,
    AnalyticsPageComponent,
    HistoryPageComponent,
    OrderPageComponent,
    CategoriesPageComponent,
    LoaderComponent,
    CategoriesFormComponent,
    PositionsFormComponent,
    OrderCategoriesComponent,
    OrderPositionsComponent,
    HistoryListComponent,
    HistoryFilterComponent
  ],
  imports: [
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    CommonModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: TokenInterceptor
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

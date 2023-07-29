import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './mycomponents/header/header.component';
import { SideNavComponent } from './mycomponents/side-nav/side-nav.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './mycomponents/dashboard/dashboard.component';
import { CreateShipmentComponent } from './mycomponents/create-shipment/create-shipment.component';
import { ShipmentDetailsComponent } from './mycomponents/shipment-details/shipment-details.component';
import { AnalysisComponent } from './mycomponents/analysis/analysis.component';
import { NotificationComponent } from './mycomponents/notification/notification.component';
import { AboutApplicationComponent } from './mycomponents/about-application/about-application.component';
import { LoginComponent } from './mycomponents/login/login.component';
import { ModifyStateComponent } from './mycomponents/modify-state/modify-state.component';
import { TrackingDetailsComponent } from './mycomponents/tracking-details/tracking-details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { QRCodeModule } from 'angular2-qrcode';
import {MatBadgeModule} from '@angular/material/badge';
import {MatIconModule} from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MapComponent } from './mycomponents/map/map.component';
import { SortPipePipe } from './pipes/sort-pipe.pipe';
import { GetMessagePipe } from './pipes/get-message.pipe';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { RoleConverterPipe } from './pipes/role-converter.pipe';
import { SortMenuPipe } from './pipes/sort-menu.pipe';
import { RegisterUserComponent } from './mycomponents/register-user/register-user.component';
import { UserProfileComponent } from './mycomponents/user-profile/user-profile.component';
import { AngularFileUploaderModule } from 'angular-file-uploader';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SideNavComponent,
    DashboardComponent,
    CreateShipmentComponent,
    ShipmentDetailsComponent,
    AnalysisComponent,
    NotificationComponent,
    AboutApplicationComponent,
    LoginComponent,
    ModifyStateComponent,
    TrackingDetailsComponent,
    MapComponent,
    SortPipePipe,
    GetMessagePipe,
    RoleConverterPipe,
    SortMenuPipe,
    RegisterUserComponent,
    UserProfileComponent,
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    SweetAlert2Module.forRoot(),
    QRCodeModule,
    MatBadgeModule,
    MatIconModule,
    MatStepperModule,
    AngularFileUploaderModule,
    PdfViewerModule

  ],
  providers: [TitleCasePipe, SortPipePipe, SortMenuPipe, DatePipe, TitleCasePipe, RoleConverterPipe],
  bootstrap: [AppComponent],
  schemas:[
    CUSTOM_ELEMENTS_SCHEMA
  ]

})
export class AppModule { }

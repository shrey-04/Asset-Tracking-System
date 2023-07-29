import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './mycomponents/header/header.component';
import { SideNavComponent } from './mycomponents/side-nav/side-nav.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './mycomponents/home/home.component';
import { DashboardComponent } from './mycomponents/dashboard/dashboard.component';
import { UserMasterComponent } from './mycomponents/user-master/user-master.component';
import { RoleMasterComponent } from './mycomponents/role-master/role-master.component';
import { PrivilegeMasterComponent } from './mycomponents/privilege-master/privilege-master.component';
import { CreateShipmentComponent } from './mycomponents/create-shipment/create-shipment.component';
import { ShipmentDetailsComponent } from './mycomponents/shipment-details/shipment-details.component';
import { AnalysisComponent } from './mycomponents/analysis/analysis.component';
import { NotificationComponent } from './mycomponents/notification/notification.component';
import { ManageComponent } from './mycomponents/manage/manage.component';
import { AboutApplicationComponent } from './mycomponents/about-application/about-application.component';
import { LoginComponent } from './mycomponents/login/login.component';
import { AddUserComponent } from './mycomponents/add-user/add-user.component';
import { AddRoleComponent } from './mycomponents/add-role/add-role.component';
import { ModifyStateComponent } from './mycomponents/modify-state/modify-state.component';
import { TrackingDetailsComponent } from './mycomponents/tracking-details/tracking-details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { QRCodeModule } from 'angular2-qrcode';
import {MatBadgeModule} from '@angular/material/badge';
import {MatIconModule} from '@angular/material/icon';
import { ModifyRoleComponent } from './mycomponents/modify-role/modify-role.component';
import { ModifyUserComponent } from './mycomponents/modify-user/modify-user.component';
import { ApproveRoleComponent } from './mycomponents/approve-role/approve-role.component';
import { ApproveUserComponent } from './mycomponents/approve-user/approve-user.component';
import { AssignPrivilegeComponent } from './mycomponents/assign-privilege/assign-privilege.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MapComponent } from './mycomponents/map/map.component';
import { SortPipePipe } from './pipes/sort-pipe.pipe';
import { GetMessagePipe } from './pipes/get-message.pipe';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { RoleConverterPipe } from './pipes/role-converter.pipe';
import { SortMenuPipe } from './pipes/sort-menu.pipe';
import { RegisterUserComponent } from './mycomponents/register-user/register-user.component';
import { WalletComponent } from './mycomponents/wallet/wallet.component';
import { CreatedNftsComponent } from './mycomponents/created-nfts/created-nfts.component';
import { MintNftComponent } from './mycomponents/mint-nft/mint-nft.component';
import { MyNftsComponent } from './mycomponents/my-nfts/my-nfts.component';
import { NftDetailsComponent } from './mycomponents/nft-details/nft-details.component';
import { NftStoreComponent } from './mycomponents/nft-store/nft-store.component';
import { UserProfileComponent } from './mycomponents/user-profile/user-profile.component';
import { AngularFileUploaderModule } from 'angular-file-uploader';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SideNavComponent,
    HomeComponent,
    DashboardComponent,
    UserMasterComponent,
    RoleMasterComponent,
    PrivilegeMasterComponent,
    CreateShipmentComponent,
    ShipmentDetailsComponent,
    AnalysisComponent,
    NotificationComponent,
    ManageComponent,
    AboutApplicationComponent,
    LoginComponent,
    AddUserComponent,
    AddRoleComponent,
    ModifyStateComponent,
    TrackingDetailsComponent,
    ModifyRoleComponent,
    ModifyUserComponent,
    ApproveRoleComponent,
    ApproveUserComponent,
    AssignPrivilegeComponent,
    MapComponent,
    SortPipePipe,
    GetMessagePipe,
    RoleConverterPipe,
    SortMenuPipe,
    RegisterUserComponent,
    WalletComponent,
    CreatedNftsComponent,
    MintNftComponent,
    MyNftsComponent,
    NftDetailsComponent,
    NftStoreComponent,
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

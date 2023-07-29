import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutApplicationComponent } from './mycomponents/about-application/about-application.component';
import { AnalysisComponent } from './mycomponents/analysis/analysis.component';
import { CreateShipmentComponent } from './mycomponents/create-shipment/create-shipment.component';
import { DashboardComponent } from './mycomponents/dashboard/dashboard.component';
import { LoginComponent } from './mycomponents/login/login.component';
import { ModifyStateComponent } from './mycomponents/modify-state/modify-state.component';
import { NotificationComponent } from './mycomponents/notification/notification.component';
import { ShipmentDetailsComponent } from './mycomponents/shipment-details/shipment-details.component';
import { TrackingDetailsComponent } from './mycomponents/tracking-details/tracking-details.component';
import { MapComponent } from './mycomponents/map/map.component';
import { AuthGuardGuard } from './services/auth-guard.guard';
import { RegisterUserComponent } from './mycomponents/register-user/register-user.component';
import { UserProfileComponent } from './mycomponents/user-profile/user-profile.component';


const routes: Routes = [
{path:"dashboard",component:DashboardComponent},
{path:"createAsset",component:CreateShipmentComponent},
{path:"shipmentDetails",component:ShipmentDetailsComponent, canActivate:[AuthGuardGuard]},
{path:"analysis",component:AnalysisComponent, canActivate:[AuthGuardGuard]},
{path:"notifications",component:NotificationComponent, canActivate:[AuthGuardGuard]},
{path:"about-application",component:AboutApplicationComponent, canActivate:[AuthGuardGuard]},
{path:'myprofile', component: UserProfileComponent},

{ path:'shipmentDetails/:assetId',component:ModifyStateComponent , canActivate:[AuthGuardGuard] },
{ path:'shipmentDetails/transactions/:assetId',component:TrackingDetailsComponent, canActivate:[AuthGuardGuard]  },
{ path:'shipmentDetails/transactions/viewMap/:assetId',component:MapComponent, canActivate:[AuthGuardGuard] },

{ path:'login',component:LoginComponent  },
{ path:'register',component:RegisterUserComponent  },
{ path:'' ,redirectTo: '/login',pathMatch:'full' },



];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuardGuard]
})
export class AppRoutingModule { }

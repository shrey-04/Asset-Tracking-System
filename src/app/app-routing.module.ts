import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutApplicationComponent } from './mycomponents/about-application/about-application.component';
import { AddRoleComponent } from './mycomponents/add-role/add-role.component';
import { AddUserComponent } from './mycomponents/add-user/add-user.component';
import { AnalysisComponent } from './mycomponents/analysis/analysis.component';
import { ApproveRoleComponent } from './mycomponents/approve-role/approve-role.component';
import { ApproveUserComponent } from './mycomponents/approve-user/approve-user.component';
import { AssignPrivilegeComponent } from './mycomponents/assign-privilege/assign-privilege.component';
import { CreateShipmentComponent } from './mycomponents/create-shipment/create-shipment.component';
import { DashboardComponent } from './mycomponents/dashboard/dashboard.component';
import { HomeComponent } from './mycomponents/home/home.component';
import { LoginComponent } from './mycomponents/login/login.component';
import { ManageComponent } from './mycomponents/manage/manage.component';
import { ModifyRoleComponent } from './mycomponents/modify-role/modify-role.component';
import { ModifyStateComponent } from './mycomponents/modify-state/modify-state.component';
import { ModifyUserComponent } from './mycomponents/modify-user/modify-user.component';
import { NotificationComponent } from './mycomponents/notification/notification.component';
import { PrivilegeMasterComponent } from './mycomponents/privilege-master/privilege-master.component';
import { RoleMasterComponent } from './mycomponents/role-master/role-master.component';
import { ShipmentDetailsComponent } from './mycomponents/shipment-details/shipment-details.component';
import { TrackingDetailsComponent } from './mycomponents/tracking-details/tracking-details.component';
import { UserMasterComponent } from './mycomponents/user-master/user-master.component';
import { MapComponent } from './mycomponents/map/map.component';
import { AuthGuardGuard } from './services/auth-guard.guard';
import { RegisterUserComponent } from './mycomponents/register-user/register-user.component';
import { WalletComponent } from './mycomponents/wallet/wallet.component';
import { MintNftComponent } from './mycomponents/mint-nft/mint-nft.component';
import { CreatedNftsComponent } from './mycomponents/created-nfts/created-nfts.component';
import { NftDetailsComponent } from './mycomponents/nft-details/nft-details.component';
import { NftStoreComponent } from './mycomponents/nft-store/nft-store.component';
import { MyNftsComponent } from './mycomponents/my-nfts/my-nfts.component';
import { UserProfileComponent } from './mycomponents/user-profile/user-profile.component';


const routes: Routes = [
{path:"home",component:HomeComponent},
{path:"dashboard",component:DashboardComponent},
{path:"user",component:UserMasterComponent, canActivate:[AuthGuardGuard]},
{path:"role",component:RoleMasterComponent, canActivate:[AuthGuardGuard]},
{path:"privilege",component:PrivilegeMasterComponent, canActivate:[AuthGuardGuard]},
{path:"createAsset",component:CreateShipmentComponent},
{path:"shipmentDetails",component:ShipmentDetailsComponent, canActivate:[AuthGuardGuard]},
{path:"analysis",component:AnalysisComponent, canActivate:[AuthGuardGuard]},
{path:"notifications",component:NotificationComponent, canActivate:[AuthGuardGuard]},
{path:"manage",component:ManageComponent, canActivate:[AuthGuardGuard] },
{path:"about-application",component:AboutApplicationComponent, canActivate:[AuthGuardGuard]},
{path:"wallet",component:WalletComponent, canActivate:[AuthGuardGuard]},
{path:'myprofile', component: UserProfileComponent},

{path:'nft-market-place', children:[
  {path:'details/:itemId', component: NftDetailsComponent},
  {path:'nft-store', component: NftStoreComponent},
  {path:'mint-nft', component: MintNftComponent},
  
  {path:'my-nfts', component: MyNftsComponent},
  {path:'my-created-nfts', component: CreatedNftsComponent},
]},

{ path:'user/addUser',component:AddUserComponent, canActivate:[AuthGuardGuard] },
{ path:'role/addRole',component:AddRoleComponent , canActivate:[AuthGuardGuard] },
{ path:'shipmentDetails/:assetId',component:ModifyStateComponent , canActivate:[AuthGuardGuard] },
{ path:'shipmentDetails/transactions/:assetId',component:TrackingDetailsComponent, canActivate:[AuthGuardGuard]  },
{ path:'shipmentDetails/transactions/viewMap/:assetId',component:MapComponent, canActivate:[AuthGuardGuard] },
{ path:'modifyRole/:roleId',component:ModifyRoleComponent, canActivate:[AuthGuardGuard]},
{ path:'modifyUser/:userId',component:ModifyUserComponent, canActivate:[AuthGuardGuard]},

{ path:'approveRole/:roleId',component:ApproveRoleComponent, canActivate:[AuthGuardGuard] },
{ path:'approveUser/:userId',component:ApproveUserComponent, canActivate:[AuthGuardGuard] },
{ path:'login',component:LoginComponent  },
{ path:'register',component:RegisterUserComponent  },
{ path:'' ,redirectTo: '/login',pathMatch:'full' },
{ path:'grantRevokePrivilege/:roleId',component:AssignPrivilegeComponent , canActivate:[AuthGuardGuard] },



];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuardGuard]
})
export class AppRoutingModule { }

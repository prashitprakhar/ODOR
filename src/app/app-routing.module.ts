import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./guards/auth.guard";
// import { IsCustomerGuard } from './guards/is-customer.guard';
// import { IsEnterprisePartnerGuard } from './guards/is-enterprise-partner.guard';

const routes: Routes = [
  // { path: "", redirectTo: "auth", pathMatch: "full" },
  { path: "", redirectTo: "homepage", pathMatch: "full" },
  { path: "auth", loadChildren: "./pages/auth/auth.module#AuthPageModule" },
  {
    path: "partnerHomePage",
    loadChildren:
      "./enterprise-partner-pages/partner-home/partner-home.module#PartnerHomePageModule",
    // canLoad: [AuthGuard] // Need to find a way out with role
  },
  // { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {
    path: "homepage",
    loadChildren: "./pages/home-page/home-page.module#HomePagePageModule",
    // canLoad: [AuthGuard] // Need to find a way out with role
  },
  {
    path: "adminHomePage",
    loadChildren:
      "./admin/pages/admin-home/admin-home.module#AdminHomePageModule",
    // canLoad: [AuthGuard] // Need to find a way out with role
  },
  {
    path: "registered-shops-list",
    loadChildren:
      "./admin/pages/registered-shops-list/registered-shops-list.module#RegisteredShopsListPageModule"
  },
  // {
  //   path: "login",
  //   loadChildren: "./shared/pages/login/login.module#LoginPageModule"
  // }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

/*
{ path: 'add-custom-orders', loadChildren: './pages/add-custom-orders/add-custom-orders.module#AddCustomOrdersPageModule' },
  { path: 'delivery-schedule', loadChildren: './pages/delivery-schedule/delivery-schedule.module#DeliverySchedulePageModule' },
  { path: 'update-personal-details', loadChildren:
  './pages/update-personal-details/update-personal-details.module#UpdatePersonalDetailsPageModule' }
*/

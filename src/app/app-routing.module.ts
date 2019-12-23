import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AuthGuard } from './guards/auth.guard';
// import { IsCustomerGuard } from './guards/is-customer.guard';
// import { IsEnterprisePartnerGuard } from './guards/is-enterprise-partner.guard';

const routes: Routes = [
  { path: "", redirectTo: "auth", pathMatch: "full" },
  { path: 'auth', loadChildren: './pages/auth/auth.module#AuthPageModule' },
  {
    path: "partnerHomePage",
    loadChildren: "./enterprise-partner-pages/partner-home/partner-home.module#PartnerHomePageModule",
    canLoad: [AuthGuard] // Need to find a way out with role
  },
  // { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {
    path: "homepage",
    loadChildren: "./pages/home-page/home-page.module#HomePagePageModule",
    canLoad: [AuthGuard] // Need to find a way out with role
  },
  {
    path: "adminHomePage",
    loadChildren: "./admin/pages/admin-home/admin-home.module#AdminHomePageModule",
    canLoad: [AuthGuard] // Need to find a way out with role
  },
  { path: 'registered-shops-list', loadChildren: './admin/pages/registered-shops-list/registered-shops-list.module#RegisteredShopsListPageModule' },
  // { path: 'admin-home', loadChildren: './admin/pages/admin-home/admin-home.module#AdminHomePageModule' },
  // { path: 'add-new-shop', loadChildren: './admin/pages/add-new-shop/add-new-shop.module#AddNewShopPageModule' },
  // { path: 'admin-account', loadChildren: './admin/pages/admin-account/admin-account.module#AdminAccountPageModule' },
  // tslint:disable-next-line: max-line-length
  // { path: 'admin-account-details', loadChildren: './admin/pages/admin-account-details/admin-account-details.module#AdminAccountDetailsPageModule' }
  // tslint:disable-next-line: comment-format
  //{ path: 'partner-my-shop', loadChildren: './enterprise-partner-pages/partner-my-shop/partner-my-shop.module#PartnerMyShopPageModule' }
  // { path: 'partner-home', loadChildren: './enterprise-partner-pages/partner-home/partner-home.module#PartnerHomePageModule' },
  // { path: 'partner-add-products', loadChildren: 
  // './enterprise-partner-pages/partner-add-products/partner-add-products.module#PartnerAddProductsPageModule' },
  // { path: 'partner-order-list', loadChildren: 
  // './enterprise-partner-pages/partner-order-list/partner-order-list.module#PartnerOrderListPageModule' },
  // { path: 'partner-account-details', loadChildren: 
  // './enterprise-partner-pages/partner-account-details/partner-account-details.module#PartnerAccountDetailsPageModule' },
  // { path: 'partner-order-details', loadChildren: 
  // './enterprise-partner-pages/partner-order-details/partner-order-details.module#PartnerOrderDetailsPageModule' }
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

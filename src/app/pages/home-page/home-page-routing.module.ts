import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomePagePage } from "./home-page.page";

const routes: Routes = [
  {
    path: "tabs",
    component: HomePagePage,
    children: [
      {
        path: "selectShop",
        children: [
          {
            path: "",
            loadChildren: "./../all-shops/all-shops.module#AllShopsPageModule"
            //./../all-shops/all-shops.module.ts#AllShopsPageModule
          },
          {
            path: ":shopId",
            loadChildren:
              "./../item-selection/item-selection.module#ItemSelectionPageModule"
          },
          {
            path: "customOrders",
            loadChildren:
              "./../add-custom-orders/add-custom-orders.module#AddCustomOrdersPageModule"
          }
        ]
      },
      {
        path: "searchShop",
        children: [
          {
            path: "",
            loadChildren:
              "./../search-shop/search-shop.module#SearchShopPageModule"
          },
          {
            path: ":shopId",
            loadChildren:
              "./../item-selection/item-selection.module#ItemSelectionPageModule"
          }
        ]
      },
      {
        path: "cart",
        children: [
          {
            path: "",
            loadChildren:
              "./../order-details/order-details.module#OrderDetailsPageModule"
          },
          {
            path: ":orderId",
            loadChildren:
              "./../order-details-confirmation/order-details-confirmation.module#OrderDetailsConfirmationPageModule"
          }
        ]
      },
      {
        path: "account",
        children: [
          {
            path: "",
            loadChildren:
              "./../account-details/account-details.module#AccountDetailsPageModule"
          }
        ]
      },
      {
        path: '',
        redirectTo: "/homepage/tabs/selectShop",
        pathMatch: "full"
      }
    ]
  },
  {
    path: '',
    redirectTo: "/homepage/tabs/selectShop",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}

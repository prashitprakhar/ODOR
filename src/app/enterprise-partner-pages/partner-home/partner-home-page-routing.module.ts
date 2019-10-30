import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PartnerHomePage } from "./partner-home.page";

const routes: Routes = [
  {
    path: "partnerTabs",
    component: PartnerHomePage,
    children: [
      {
        path: "partnerMyShop",
        children: [
          {
            path: "",
            loadChildren: "./../partner-my-shop/partner-my-shop.module#PartnerMyShopPageModule"
          }
        //   {
        //     path: ":shopId",
        //     loadChildren:
        //       "./../item-selection/item-selection.module#ItemSelectionPageModule"
        //   },
        //   {
        //     path: "customOrders",
        //     loadChildren:
        //       "./../add-custom-orders/add-custom-orders.module#AddCustomOrdersPageModule"
        //   }
        ]
      },
      {
        path: "addProducts",
        children: [
          {
            path: "",
            loadChildren:
              "./../partner-add-products/partner-add-products.module#PartnerAddProductsPageModule"
          },
        //   {
        //     path: ":shopId",
        //     loadChildren:
        //       "./../item-selection/item-selection.module#ItemSelectionPageModule"
        //   }
        ]
      },
      {
        path: "partnerOrders",
        children: [
          {
            path: "",
            loadChildren:
              "./../partner-order-list/partner-order-list.module#PartnerOrderListPageModule"
          },
        //   {
        //     path: ":orderId",
        //     loadChildren:
        //       "./../order-details-confirmation/order-details-confirmation.module#OrderDetailsConfirmationPageModule"
        //   }
        ]
      },
      {
        path: "partnerAccount",
        children: [
          {
            path: "",
            loadChildren:
              "./../partner-account-details/partner-account-details.module#PartnerAccountDetailsPageModule"
          }
        ]
      },
      {
        path: '',
        redirectTo: "/partnerHomePage/partnerTabs/partnerMyShop",
        pathMatch: "full"
      }
    ]
  },
  {
    path: '',
    redirectTo: "/partnerHomePage/partnerTabs/partnerMyShop",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartnerHomePageRoutingModule {}

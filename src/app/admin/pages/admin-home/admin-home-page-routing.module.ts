
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminHomePage } from "./admin-home.page";

const routes: Routes = [
    {
      path: "adminTab",
      component: AdminHomePage,
      children: [
        {
          path: "allRegisteredShops",
          children: [
            {
              path: "",
              loadChildren: "./../registered-shops-list/registered-shops-list.module#RegisteredShopsListPageModule"
            }
          ]
        },
        {
          path: "addNewShop",
          children: [
            {
              path: "",
              loadChildren: "./../add-new-shop/add-new-shop.module#AddNewShopPageModule"
            }
          ]
        },
        // allRegisteredShops
        {
          path: "adminAccount",
          children: [
            {
              path: "",
              loadChildren:
                "./../admin-account-details/admin-account-details.module#AdminAccountDetailsPageModule"
            }
          ]
        },
        {
          path: '',
          redirectTo: "/adminHomePage/adminTab/addNewShop",
          pathMatch: "full"
        }
      ]
    },
    {
      path: '',
      redirectTo: "/adminHomePage/adminTab/addNewShop",
      pathMatch: "full"
    }
  ];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class AdminHomePageRoutingModule {}
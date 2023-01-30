import gql from 'graphql-tag';
import { SHOP_PRODUCT_FRAGMENT } from '@graphql/operations/fragment/shop-product';

export const HOME_PAGE = gql`
  query HomePageInfo(
    $showPlatform: Boolean = false
    $relationScreens: Boolean = false
  ) {
    carousel: shopProductsOffersLast(itemsPage: 6, topPrice: 30, random: true) {
      shopProducts {
        ...ShopProductObject
      }
    }
    pc: shopProductsPlatforms(
        itemsPage: 4
      platform: ["4"]
      random: true
    ) {
      shopProducts {
        ...ShopProductObject
      }
    }
    ps3: shopProductsPlatforms(
      itemsPage: 4
      platform: ["16"]
      random: true
    ) {
      shopProducts {
        ...ShopProductObject
      }
    }
    android: shopProductsPlatforms(
      itemsPage: 4
      platform: ["21"]
      random: true
    ) {
      shopProducts {
        ...ShopProductObject
      }
    }
    topPrice35: shopProductsOffersLast(
      itemsPage: 4
      topPrice: 35
      random: true
    ) {
      shopProducts {
        ...ShopProductObject
      }
    }
  }
  ${SHOP_PRODUCT_FRAGMENT}
`;

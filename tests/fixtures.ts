import { test as base } from '@playwright/test';
import { AccountCreationPage } from './pages/AccountCreationPage';
import { LoginPage } from './pages/LoginPage';
import { CartPage } from './pages/CartPage';

type Pages = {
  accountCreation: AccountCreationPage;
  login: LoginPage;
  cart: CartPage;
};

const test = base.extend<Pages>({
  accountCreation: async ({ page }, use) => {
    await use(new AccountCreationPage(page));
  },
  login: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  cart: async ({ page }, use) => {
    await use(new CartPage(page));
  }
});

export { test };

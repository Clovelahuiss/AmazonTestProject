import { test, expect } from '@playwright/test';
import { CartPage } from './pages/CartPage';
import { LoginPage } from './pages/LoginPage';

test.describe('Tests de recherche, ajout au panier et connexion', () => {

  test.beforeEach(async({ page }) => {
    await page.goto('https://www.amazon.fr/');
    try {
      await page.click('#sp-cc-accept', { timeout: 3000 }); // Acceptation des cookies
    } catch (error) {
      console.log('Bouton de cookie non présent, on continue sans souci.');
    }
  });

  test('Recherche de produit et ajout au panier', async ({ page }) => {
    const cartPage = new CartPage(page);
    await cartPage.searchForProduct('Iphone');
    await cartPage.addToCart();
    await expect(cartPage.textAdded).toBeVisible();
  });

  test('Suppression d\'un produit du panier', async ({ page }) => {
    const cartPage = new CartPage(page);
    await cartPage.searchForProduct('Iphone');
    await cartPage.addToCart();
    await cartPage.delFirstArticle();
  });

  test('Test End-to-End recherche-ajout-connexion', async ({ page }) => {
    const cartPage = new CartPage(page);
    const loginPage = new LoginPage(page);

    // Étape 1 : Recherche et ajout au panier
    await cartPage.searchForProduct('Iphone');
    await cartPage.addToCart();
    await expect(cartPage.textAdded).toBeVisible();

    // Étape 2 : Aller dans le panier et se connecter
    await cartPage.goToLoginFromCart();
    await expect(page).toHaveURL(/.*ap\/signin/);

    // Étape 3 : Connexion avec un email et mot de passe valides
    await loginPage.login('charpentierlouis011@gmail.com', 'Test@test.com7878$');

    // Vérification de la connexion
    try {
      await expect(page).toHaveURL('https://www.amazon.fr/cart?app-nav-type=none&dc=df');
      console.log('Utilisateur connecté et redirigé vers la page d\'accueil');
    } catch {
      const phoneMessage = await loginPage.getPhoneMessage();
      expect(phoneMessage).toContain('Pour votre sécurité, nous avons envoyé le code sur votre numéro de téléphone');
      console.log('Demande de numéro de téléphone détectée');
    }
  });

  test('Rechercher des téléviseurs et filtrer par marque Samsung', async ({ page }) => {
    const cartPage = new CartPage(page);
    await cartPage.searchForProduct('Televiseurs');
    await cartPage.filterByBrand();
  });

});

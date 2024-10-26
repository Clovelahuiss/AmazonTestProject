import { Locator, Page, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly inputSearch: Locator;
  readonly submitSearch: Locator;
  readonly brandSelection: Locator;
  readonly firstProductName: Locator;
  readonly product: Locator;
  readonly productLink: Locator;
  readonly productProtection: Locator;
  readonly addToCartBtn: Locator;
  readonly textAdded: Locator;
  readonly cart: Locator;
  readonly delButton: Locator;
  readonly textDel: Locator;
  readonly loginLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Recherche générale
    this.inputSearch = page.getByPlaceholder('Rechercher Amazon.fr');
    this.submitSearch = page.getByRole('button', { name: 'Go', exact: true });

    // Sélection des filtres et produits
    this.brandSelection = page.getByRole('link', { name: 'Samsung', exact: true });
    this.firstProductName = page.locator('.s-title-instructions-style').first();
    this.product = page.locator('.s-product-image-container').first();
    this.productLink = page.locator('.rush-component > .a-link-normal').first();

    // Gestion du panier
    this.productProtection = page.getByRole('button', { name: 'Non, merci.' });
    this.addToCartBtn = page.getByRole('button', { name: 'Ajouter au panier' });
    this.textAdded = page.getByRole('heading', { name: 'Ajouté au panier' });
    this.cart = page.getByLabel('article dans le panier');
    this.delButton = page.locator('.a-size-small > .a-declarative').first();
    this.textDel = page.getByRole('heading', { name: 'Votre panier Amazon est vide' });

    // Lien pour se connecter via le panier
    this.loginLink = page.getByText('connectez-vous à votre compte');
  }

  // Action de recherche
  async searchForProduct(productName: string) {
    await this.inputSearch.click();
    await this.inputSearch.fill(productName);
    await this.submitSearch.click();
    await expect(this.product).toBeVisible();
  }

  // Action pour filtrer par marque (exemple Samsung)
  async filterByBrand() {
    await this.brandSelection.click();
    await expect(this.firstProductName).toBeVisible();
    await expect(this.firstProductName).toContainText('Samsung');
  }

  // Action pour ajouter un produit au panier
  async addToCart() {
    await this.productLink.click();
    await this.addToCartBtn.click();
    const protectionSidebar = this.page.locator('#attach-warranty-display').getByText('Protégez ce produit :');
    if (await protectionSidebar.isVisible()) {
      await this.productProtection.click();
    }
    await expect(this.textAdded).toBeVisible();
  }

  // Action pour supprimer le premier article du panier
  async delFirstArticle() {
    await this.cart.click();
    await this.delButton.click();
    await expect(this.textDel).toBeVisible();
  }

  // Action pour aller au panier et cliquer sur le lien de connexion
  async goToLoginFromCart() {
    await this.cart.click();
    await this.loginLink.click();
  }
}

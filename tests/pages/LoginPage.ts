import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailField: Locator;
  readonly continueButton: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly phoneMessage: Locator;

  constructor(page: Page) { 
    this.page = page;
    this.emailField = page.locator('#ap_email');
    this.continueButton = page.locator('#continue.a-button-input');
    this.passwordField = page.locator('#ap_password.a-input-text.a-span12.auth-autofocus.auth-required-field');
    this.loginButton = page.locator('#signInSubmit.a-button-input');

    // Pour l'erreur spécifique de l'email
    this.errorMessage = page.locator('.a-alert-content').filter({ hasText: 'Saisissez une adresse e-mail ou un numéro de téléphone valide' });
    
    // Pour le message lié au numéro de téléphone
    this.phoneMessage = page.locator('.a-alert-content').filter({ hasText: 'Pour votre sécurité, nous avons envoyé le code sur votre numéro de téléphone' });
  }

  async loginEmailTest(email: string) {
    await this.emailField.fill(email);
    await this.continueButton.click();
  }

  async login(email: string, password: string) {
    await this.emailField.fill(email);
    await this.continueButton.click();
    await this.passwordField.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage() {
    return this.errorMessage.innerText();
  }

  async getPhoneMessage(){
    return this.phoneMessage.innerText();
  }
}

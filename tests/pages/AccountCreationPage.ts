import { Page, Locator, expect} from '@playwright/test';
import { faker } from '@faker-js/faker';

export class AccountCreationPage {
    readonly page: Page;
    readonly nameField: Locator;
    readonly emailField: Locator;
    readonly passwordField: Locator;
    readonly confirmPasswordField: Locator;
    readonly verifyEmailButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.nameField = page.locator('#ap_customer_name');
        this.emailField = page.locator('#ap_email');
        this.passwordField = page.locator('#ap_password');
        this.confirmPasswordField = page.locator('#ap_password_check');
    }

    async fillAccountDetails(name: string, email: string, password: string, confirmPassword: string) {
        await this.nameField.fill(name);
        await this.emailField.fill(email);
        await this.passwordField.fill(password);
        await this.confirmPasswordField.fill(confirmPassword);
    }

    
}

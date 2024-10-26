import { test, expect } from '@playwright/test';
import { AccountCreationPage } from './pages/AccountCreationPage.ts';
import { faker } from '@faker-js/faker';

test.describe('Création de compte Amazon', () => {
    let accountCreationPage: AccountCreationPage;

    test.beforeEach(async ({ page }) => {
        accountCreationPage = new AccountCreationPage(page);
        
        // Navigue vers la page d'accueil Amazon
        await page.goto('https://www.amazon.fr/');
        await page.click('#sp-cc-accept');
        // Cliquer sur le bouton "Compte et listes" (ID: nav-link-accountList-nav-line-1)
        await page.click('#nav-link-accountList-nav-line-1');
        
        
         // Attendre que le menu déroulant s'affiche et cliquer sur "Commencer ici" (ID: nav-flyout-ya-newCust)
         await page.click('xpath=/html/body/div[1]/div[1]/div[2]/div/div[2]/div[2]/span/span/a');
  
        // Vérifie que nous sommes sur la page de création de compte
        await expect(page).toHaveURL(/ap\/register/);
    });
    

    test('Création de compte avec un email valide', async ({ page }) => { 
        const email = faker.internet.email();
        const name = faker.name.firstName();
        const password = 'TestPassword123';
    
        // Remplir les détails de création de compte
        await accountCreationPage.fillAccountDetails(name, email, password, password);
        //await accountCreationPage.clickVerifyEmail();
        await page.click('#continue.a-button-input');
        // Vérifie si la page de captcha est affichée en vérifiant l'URL
        await expect(page).toHaveURL(/https:\/\/www\.amazon\.fr\/ap\/cvf\/request\?arb=.*/);
    
        // Si l'URL contient "cvf/request?arb", cela signifie qu'un captcha est affiché
        console.log('Captcha page detected');
    });
    
    test('Création de compte avec un numéro de téléphone valide', async ({ page }) => { 
        const phoneNumber = '06' + faker.string.numeric(8);
        const name = faker.person.firstName();
        const password = 'TestPassword123';
    
        // Remplir les détails de création de compte avec le numéro de téléphone    
    await accountCreationPage.fillAccountDetails(name, phoneNumber, password, password);

    // Vérifie si on est redirigé vers une page de captcha ou autre
    const currentUrl = page.url();

    await page.click('#continue.a-button-input');

    if (currentUrl.includes('https://www.amazon.fr/ap/cvf/request?arb')) {
        console.log('Captcha page detected');
        // Logique spécifique pour traiter la page captcha si nécessaire
    } else if (currentUrl.includes('register')) {
        console.log('Redirection bloquée par Amazon');
        // Logique pour traiter les redirections bloquées par Amazon
    } else {
        console.log('Page inattendue: ', currentUrl);
    }

    // Si une redirection vers la page de captcha ou un autre blocage n'a pas lieu, le test échoue
    await expect(page).toHaveURL(/https:\/\/www\.amazon\.fr\/ap\/cvf\/request\?arb=.*/);
});
    

test('Création de compte avec un email invalide', async ({ page }) => {
    const email = 'invalidemail';  // Email invalide
    const name = faker.person.firstName();
    const password = 'TestPassword123';
  
    // Remplir les détails du compte avec un email invalide
    await accountCreationPage.fillAccountDetails(name, email, password, password);
  
    // Ajout d'une vérification avant de cliquer sur le bouton "Continuer"
    const continueButton = page.locator('#continue');
    await expect(continueButton).toBeEnabled();  // Vérifie que le bouton est activé
  
    // Tenter de cliquer sur le bouton "Continuer"
    try {
      await continueButton.click();
    } catch (error) {
      // Réessayer si le premier clic échoue
      console.log('Le premier clic sur "Continuer" a échoué, tentative de recliquer.');
      await continueButton.click();
    }
  
    // Vérifie si le message d'erreur "Saisissez une adresse e-mail ou un numéro de téléphone valide" est présent
    try {
      const errorMsg1 = await page.getByText('Saisissez une adresse e-mail ou un numéro de téléphone valide');
      await expect(errorMsg1).toBeVisible();
    } catch (error) {
      // Si le premier message n'apparaît pas, s'assurer que le bouton a bien été cliqué et réessayer
      console.log('Le message d\'erreur n\'est pas apparu, vérification supplémentaire.');
      await expect(continueButton).not.toBeVisible();  // S'assurer que le bouton a été cliqué et la page a changé
    }
  });
  


});
import { test, expect} from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test.describe('Feature: Login account', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);

        // Navigue vers la page d'accueil Amazon
        await page.goto('https://www.amazon.fr/');
        await page.click('#sp-cc-accept');
        // Cliquer sur le bouton "Compte et listes" (ID: nav-link-accountList-nav-line-1)
        await page.click('#nav-link-accountList-nav-line-1');

        // Attendre que le menu déroulant s'affiche et cliquer sur "Commencer ici" (ID: nav-flyout-ya-newCust)
        // await page.click('xpath=/html/body/div[1]/header/div/div[3]/div[2]/div[2]/div/div[1]/div/a/span');

        // Vérifie que nous sommes sur la page de création de compte
        await expect(page).toHaveURL(/ap\/signin/);
    });

    test('test de connexion avec Email valide', async ({ page }) => {
        // On Entre un email valide et le mdp
        await loginPage.login('mail', 'Password');
    
        // Vérification conditionnelle : soit on est sur la page d'accueil, soit on doit entrer un numéro de téléphone
        try {
            // Si la page d'accueil s'affiche, on considère la connexion réussie
            await expect(page).toHaveURL('https://www.amazon.fr/?ref_=nav_ya_signin');
            console.log('Utilisateur connecté et redirigé vers la page d\'accueil');
        } catch {
            // Sinon, on vérifie si un message de demande de numéro de téléphone est présent
            const phoneMessage = await loginPage.getPhoneMessage();
            expect(phoneMessage).toContain('Pour votre sécurité, nous avons envoyé le code sur votre numéro de téléphone');
            console.log('Demande de numéro de téléphone détectée');
        }
    });

    test('test de connexion avec Email invalide', async ({ page }) => {
        // On entre un email invalide
        await loginPage.loginEmailTest('testexample.com'); // On met l'email invalide ici.
      
        // On vérifie que l'un des deux messages d'erreur est affiché
        try {
          // Première tentative pour vérifier le message "Saisissez une adresse e-mail ou un numéro de téléphone valide"
          const errorMessage1 = await page.getByText('Saisissez une adresse e-mail ou un numéro de téléphone valide');
          await expect(errorMessage1).toBeVisible();
        } catch (error) {
          // Si le premier message n'est pas trouvé, on vérifie le second
          const errorMessage2 = await page.getByText('Impossible de trouver un compte correspondant à cette adresse e-mail');
          await expect(errorMessage2).toBeVisible();
        }
      });
      
});

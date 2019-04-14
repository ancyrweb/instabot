import { WebNavigator } from "./WebNavigator";
import { ElementHandle, Page } from "puppeteer";
import AuthenticatorInterface from "./interfaces/AuthenticatorInterface";

class Authenticator implements AuthenticatorInterface {
  private navigator: WebNavigator;
  constructor(navigator: WebNavigator) {
    this.navigator = navigator;
  }

  authenticate(username: string, password: string): Promise<boolean> {
    return this.navigator.getPage("/accounts/login", async (page: Page) => {
      await page.waitForSelector('input[name="username"]');

      const usernameInput = await page.$('input[name="username"]');
      const passwordInput = await page.$('input[name="password"]');

      if (!usernameInput || !passwordInput) return;

      await usernameInput.type(username, { delay: 50 });
      await passwordInput.type(password, { delay: 50 });

      const loginButtonSelector = await page.evaluate(() => {
        const { scraper } = window as any;

        const loginButton = scraper.findOneWithText({
          selector: "button",
          text: "Log in"
        });

        if (!loginButton) return "";

        return loginButton
          .setscraperAttr("loginButton", "loginButton")
          .getSelectorByscraperAttr("loginButton");
      });

      if (!loginButtonSelector) return;

      const loginButton = (await page.$(loginButtonSelector)) as ElementHandle;
      await loginButton.click();
      await page.waitFor(5000);
      return page;
    });
  }
}

export default Authenticator;

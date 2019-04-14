import { Browser, launch, Page } from "puppeteer";
import * as path from "path";
import { OrNull } from "../types";
import NavigatorInterface from "./interfaces/NavigatorInterface";

export class WebNavigator implements NavigatorInterface<Page> {
  private browser: OrNull<Browser> = null;
  private page: OrNull<Page> = null;

  private headless: boolean = true;
  private userAgent: OrNull<string> = null;

  constructor(config: { headless: boolean; userAgent: string }) {
    this.headless = config.headless;
    this.userAgent = config.userAgent;
  }
  getUrl(endpoint: string) {
    return `https://www.instagram.com${endpoint}`;
  }

  async getBrowser(): Promise<Browser> {
    if (!this.browser) {
      this.browser = await launch({
        headless: this.headless,
        args: this.headless ? ['--no-sandbox'] : [],
      });
    }

    return this.browser;
  }

  async getCurrentPage(): Promise<Page> {
    if (!this.page) {
      const browser = await this.getBrowser();
      this.page = await browser.newPage();
      if (this.userAgent) {
        await this.page.setUserAgent(this.userAgent);
      }

      this.page.on("console", msg => console.log("PAGE LOG:", msg.text()));
    }

    return this.page;
  }
  async getPage(endpoint: string, cb: (page: Page) => any) {
    const page = await this.getCurrentPage();
    await page.goto(this.getUrl(endpoint));
    await page.addScriptTag({
      path: path.join(__dirname, "./helper/scrapper.js")
    });

    try {
      return await cb(page);
    } catch (e) {
      console.error("Page crashed : " + e.message);
      return null;
    }
  }
  close() {
    if (!this.browser) return;

    return this.browser.close();
  }
}

export default WebNavigator;

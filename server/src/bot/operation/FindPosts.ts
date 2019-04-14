import OperationInterface from "../interfaces/OperationInterface";
import WebNavigator from "../WebNavigator";

export type FindPostVariables = {
  tag: string;
  amount: number;
};

export type FindPostOutcome = string[];

const topPosts = 9;
const postsFetchedPerScroll = 12;

class FindPosts
  implements OperationInterface<FindPostVariables, FindPostOutcome> {
  private navigator: WebNavigator;
  constructor(navigator: WebNavigator) {
    this.navigator = navigator;
  }
  work(variables: FindPostVariables): Promise<FindPostOutcome> {
    return this.navigator.getPage(
      "/explore/tags/" + variables.tag,
      async page => {
        await page.evaluate(
          (amount, postsFetchedPerScroll) => {
            const { scraper } = window as any;
            return scraper.scrollPageTimes({
              times: Math.ceil(amount / postsFetchedPerScroll)
            });
          },
          variables.amount,
          postsFetchedPerScroll
        );

        await page.waitFor(2000);
        return await page.evaluate(
          (topPosts, amount) => {
            const { scraper } = window as any;
            return scraper
              .find({
                selector: 'a[href^="/p/"]',
                count: topPosts + amount
              })
              .slice(9) // The 9 firsts
              .map((el: any) => el.getAttr("href"));
          },
          topPosts,
          variables.amount
        );
      }
    );
  }
}

export default FindPosts;

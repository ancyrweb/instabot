import OperationInterface from "../interfaces/OperationInterface";
import WebNavigator from "../WebNavigator";
import { rand } from "../helper/utils";

export type ActOnPostVariables = {
  url: string;
  like: boolean;
  follow: number;
};

export type ActOnPostOutcome = {
  liked: boolean;
  followed: boolean;
};

class ActOnPost
  implements OperationInterface<ActOnPostVariables, ActOnPostOutcome> {
  private navigator: WebNavigator;
  constructor(navigator: WebNavigator) {
    this.navigator = navigator;
  }

  work(variables: ActOnPostVariables): Promise<ActOnPostOutcome> {
    return this.navigator.getPage(variables.url, async page => {
      const results = await page.evaluate(
        opts => {
          const { scraper } = window as any;
          const controller = scraper.InstaUtils.getPostController();

          let promises = [];
          if (opts.like) {
            if (controller.isLiked === false) {
              let acceptable = scraper.acceptable();
              promises.push(acceptable.promise);
              setTimeout(() => {
                controller.like();
                acceptable.accept({
                  type: "like",
                  when: scraper.nowFormatted()
                });
              }, scraper.rand(1000, 2000));
            }
          }

          if (opts.follow) {
            if (controller.isFollowed === false) {
              let acceptable = scraper.acceptable();
              promises.push(acceptable.promise);

              setTimeout(() => {
                controller.follow();
                acceptable.accept({
                  type: "follow",
                  when: scraper.nowFormatted()
                });
              }, scraper.rand(2500, 3500));
            }
          }

          return Promise.all(promises);
        },
        { like: variables.like, follow: variables.follow }
      );

      let liked = false, followed = false;
      results.forEach((obj: any) => {
        if (obj.type === "like")
          liked = true;
        else if (obj.type === "follow")
          followed = true;

      });

      await page.waitFor(rand(2000, 8000));
      return {
        liked,
        followed
      };
    });
  }
}

export default ActOnPost;

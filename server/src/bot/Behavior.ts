import { timestamp, sleep } from "./helper/time";
import { rand } from "./helper/utils";
import { OrNull } from "../types";
import BehaviorInterface from "./interfaces/BehaviorInterface";

type ActionsEnum = "scanPost";
type Action = {
  name: string;
  start: number;
  end: OrNull<number>;
};

export class Behavior implements BehaviorInterface {
  history: Action[] = [];
  currentAction: OrNull<Action> = null;
  lastPause: OrNull<number> = null;
  nextPauseIn: OrNull<number> = null;
  pauseCount: number = 0;
  nextPauseHowLong: number = 0;

  minimumWorkingTime: number;
  maximumWorkingTime: number;
  shortPauseMinimumTime: number;
  shortPauseMaximumTime: number;
  longPauseMinimumTime: number;
  longPauseMaximumTime: number;

  constructor(conf : {
    minimumWorkingTime: number
    maximumWorkingTime: number
    shortPauseMinimumTime: number
    shortPauseMaximumTime: number
    longPauseMinimumTime: number
    longPauseMaximumTime: number
  }) {
   this.minimumWorkingTime = conf.minimumWorkingTime;
   this.maximumWorkingTime = conf.maximumWorkingTime;
   this.shortPauseMinimumTime = conf.shortPauseMinimumTime;
   this.shortPauseMaximumTime = conf.shortPauseMaximumTime;
   this.longPauseMinimumTime = conf.longPauseMinimumTime;
   this.longPauseMaximumTime = conf.longPauseMaximumTime;
  }
  startAction(name: ActionsEnum) {
    this.currentAction = {
      name,
      start: Date.now(),
      end: null
    };
  }
  stopAction(name: ActionsEnum) {
    if (!this.currentAction) return;

    this.currentAction.end = Date.now();
    this.history.push(this.currentAction);
    this.currentAction = null;
  }
  shouldTakePause() {
    if (!this.lastPause) {
      this.lastPause = timestamp();
      this.nextPauseIn = 60 * rand(30, 45); // 30 and 45 minutes;
      return false;
    }

    return timestamp() - this.lastPause > (this.nextPauseIn as number);
  }
  nextPauseDuration(): number {
    if (this.nextPauseHowLong === 0) {
      this.nextPauseHowLong = this.pauseCount === 10 ? rand(10, 20) : rand(2, 8);
    }

    return this.nextPauseHowLong;
  }

  async takePause() {
    const forLong = this.nextPauseDuration();
    await sleep(forLong * 60 * 1000);

    this.pauseCount++;
    if (this.pauseCount > 10) {
      this.pauseCount = 0;
    }

    this.lastPause = timestamp();
    this.nextPauseIn = 60 * rand(30, 45);
    this.nextPauseHowLong = 0;
  }
}

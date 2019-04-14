export default interface BehaviorInterface {
  shouldTakePause(): boolean;
  takePause(): Promise<void>;
  nextPauseDuration(): number;
}

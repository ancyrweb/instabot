import { StringMap } from "../types";
import AuthenticatorInterface from "./interfaces/AuthenticatorInterface";
import OperationInterface from "./interfaces/OperationInterface";
import BehaviorInterface from "./interfaces/BehaviorInterface";
import NavigatorInterface from "./interfaces/NavigatorInterface";
import LooperInterface from "./interfaces/LooperInterface";

export class Operator {
  private behavior: BehaviorInterface;
  private operations: StringMap<OperationInterface<any, any>>;

  private working = true;

  constructor(
    behavior: BehaviorInterface,
    operations: StringMap<OperationInterface<any, any>>
  ) {
    this.behavior = behavior;
    this.operations = operations;
  }

  shouldTakePause() {
    return this.behavior.shouldTakePause();
  }
  takePause() {
    return this.behavior.takePause();
  }
  nextPauseDuration() {
    return this.behavior.nextPauseDuration();
  }
  dispatch<Variables = any, Outcome = any>(
    name: string,
    variables: Variables
  ): Promise<Outcome> {
    if (!this.operations[name]) {
      throw new Error("operation " + name + " doesn't exist.");
    }

    return this.operations[name].work(variables);
  }

  start() {
    this.working = true;
  }
  stop() {
    this.working = false;
  }

  isStopped() {
    return this.working === false;
  }
}

export class Controller<PageType = any> {
  private navigator: NavigatorInterface<PageType>;
  private behavior: BehaviorInterface;
  private authenticator: AuthenticatorInterface;
  private operations: StringMap<OperationInterface<any, any>>;
  private looper: LooperInterface<any>;

  private operator: Operator;

  constructor(config: {
    navigator: NavigatorInterface<PageType>;
    behavior: BehaviorInterface;
    authenticator: AuthenticatorInterface;
    operations: StringMap<OperationInterface<any, any>>;
    looper: LooperInterface<any>
  }) {
    this.navigator = config.navigator;
    this.behavior = config.behavior;
    this.authenticator = config.authenticator;
    this.operations = config.operations;
    this.looper = config.looper;
    this.operator = new Operator(this.behavior, this.operations);
  }

  authenticate(username: string, password: string) {
    return this.authenticator.authenticate(username, password);
  }

  loop() {
    // The looping mechanism works by wrapping the looper inside a setTimeout loop.
    // This is the only way for us to get a hook into the looping process.
    // As such, it will check if we issued a stop command. The looper implementation can also
    // Make on-time checks to stop between actions as to provide the illusion of real time bot controlling.
    this.operator.start();

    // Do not block the thread with the looper
    const doLoop = () => {
      if (this.operator.isStopped())
        return;

      setTimeout(async () => {
        await this.looper.run(this.operator);
        doLoop();
      }, 0);
    };

    doLoop();
  }

  stop() {
    this.operator.stop();
  }
}

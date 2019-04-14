import { StringMap } from "../types";
import AuthenticatorInterface from "./interfaces/AuthenticatorInterface";
import OperationInterface from "./interfaces/OperationInterface";
import BehaviorInterface from "./interfaces/BehaviorInterface";
import NavigatorInterface from "./interfaces/NavigatorInterface";

export class Operator {
  private behavior: BehaviorInterface;
  private operations: StringMap<OperationInterface<any, any>>;

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
}

export class Controller<PageType = any> {
  private navigator: NavigatorInterface<PageType>;
  private behavior: BehaviorInterface;
  private authenticator: AuthenticatorInterface;
  private operations: StringMap<OperationInterface<any, any>>;

  constructor(config: {
    navigator: NavigatorInterface<PageType>;
    behavior: BehaviorInterface;
    authenticator: AuthenticatorInterface;
    operations: StringMap<OperationInterface<any, any>>;
  }) {
    this.navigator = config.navigator;
    this.behavior = config.behavior;
    this.authenticator = config.authenticator;
    this.operations = config.operations;
  }

  authenticate(username: string, password: string) {
    return this.authenticator.authenticate(username, password);
  }

  loop(
    callback: (operator: Operator) => Promise<any>
  ): {
    stop: () => void;
  } {
    let goOn = true;
    let operator = new Operator(this.behavior, this.operations);

    setTimeout(async () => {
      while (goOn) {
        await callback(operator);
      }
    }, 0);

    return {
      stop() {
        goOn = false;
      }
    };
  }
}

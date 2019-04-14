import {Operator} from "../Controller";

export default interface LooperInterface<T = any> {
  run(operator: Operator) : T;
}



export default interface OperationInterface<Variables, Outcome> {
  work(variables: Variables): Promise<Outcome>;
}

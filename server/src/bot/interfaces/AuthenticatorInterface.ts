export default interface AuthenticatorInterface {
  authenticate(username: string, password: string): Promise<boolean>;
}

export default interface NavigatorInterface<PageType> {
  getPage(endpoint: string, cb: (page: PageType) => any): Promise<any>;
}

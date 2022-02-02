export class UrlUtils {
  constructor({ url, parameters }) {
    this.url = url;
    this.parameters = parameters;
    this.fullURl = undefined;
  }

  getFullUrl() {
    if (!this.fullURl)
      this.fullURl = `${this.url}/${this.parameters.join("/")}/`.trim();
    return this.fullURl;
  }

  isRootPage(url) {
    if (url && url.charAt(url.length - 1) !== "/") url += "/";
    return this.getFullUrl() === url;
  }

  nomalizeUrl(url) {
    if (!url || url.length === 0 || url === "/") return this.getFullUrl();
    url = url.split("?")[0];
    if (this.isUrlValid(url)) return url;
    if (url.startsWith("/questions")) return this.url + url + "/";
    if (url.startsWith("question")) return `${this.url}/${url}/`;
    return this.getFullUrl() + url + "/";
  }

  isUrlValid(url) {
    return url && (this.isRootPage(url) || url.startsWith(this.getFullUrl()));
  }
  getUniqueId(url) {
    if (!url || this.isRootPage(url)) return 0;
    url = this.nomalizeUrl(url);
    return url.trim().split(/[\/\?]/)[4];
  }
  getLinkQuestion(url) {
    if (this.isRootPage(url)) return null;
    url = this.nomalizeUrl(url);
    return url.trim().split(/[\/\?]/)[5];
  }
}

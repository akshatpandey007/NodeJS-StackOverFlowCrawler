import { stateLoz } from "./Logger.js";
import QuestionModel from "./QuestionModel.js";

export default class State {
  constructor() {
    this.visitedUrls = {};
    this.crawledUrls = [];
    this.beingCrawledUrls = [];
  }

  clear() {
    this.visitedUrls = {};
    this.crawledUrls = {};
    this.beingCrawledUrls = {};
  }

  visitUrl(url) {
    if (Boolean(this.visitedUrls[url])) this.visitedUrls[url]++;
    else this.visitedUrls[url] = 1;
    stateLoz(url, " ", this.visitedUrls[url]);
    // QuestionModel.updateRefCount(url, this.visitedUrls[url]);
  }

  isVisitedUrl(url) {
    stateLoz(url, " ", this.visitedUrls[url]);
    return Boolean(this.visitedUrls[url]);
  }

  increaseVisitCount(url) {
    return ++this.visitedUrls[url];
  }

  startCrawlingUrl(url) {
    if (this.beingCrawledUrls.indexOf(url) < 0) {
      this.beingCrawledUrls.push(url);
      return true;
    }
    return false;
  }

  urlCrawled(url) {
    return this.crawledUrls.indexOf(url) > 0;
  }

  urlBeingCrawled(url) {
    return this.beingCrawledUrls.indexOf(url) > 0;
  }

  getVisitCount(url) {
    if (!this.isVisitedUrl(url)) return 0;
    return this.visitedUrls[url];
  }

  finishCrawlingUrl(url) {
    let tempIndex = this.beingCrawledUrls.indexOf(url);
    if (tempIndex >= 0) {
      this.beingCrawledUrls.splice(tempIndex, 1);
    }
    this.crawledUrls.push(url);
  }
}

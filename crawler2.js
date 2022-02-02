import { state as crawlerState, urlConfig } from "./config.js";
import Executor from "./executor.js";
import loz from "./Logger.js";
import QuestionModel from "./QuestionModel.js";
import request from "./request.js";

export default class Crawler {
  constructor({ maxConcurrentRequests = 5 }) {
    this.maxConcurrentRequests = maxConcurrentRequests;
    this.executor = new Executor({
      maxConcurrentRequest: this.maxConcurrentRequests,
    });
    this.state = crawlerState;
    this.tempState = 0;
  }

  crawl(url) {
    this.executor.startExecution();
    this.crawlUrl(url);
  }

  crawlUrl(url) {
    url = urlConfig.nomalizeUrl(url);
    const id = urlConfig.getUniqueId(url);

    this.state.visitUrl(id);
    if (this.state.getVisitCount(id) > 1) return;

    this.executor.push(() => {
      if (this.state.urlBeingCrawled(id) || this.state.urlCrawled(id))
        return Promise.resolve();

      loz("Started Crawling : ", url);

      this.state.startCrawlingUrl(id);

      request(url, (err, response) => {
        if (err || !response) return console.log(err);
        let allUrls = [],
          numAnswers = 0,
          numUpvotes = 0,
          question = "";
        allUrls = response.findAllLinks();
        numUpvotes = response.findUpVotes();
        numAnswers = response.findAnswers();
        question = response.findQuestionText();
        QuestionModel.writeToDB({
          uid: id,
          numAnswers: numAnswers,
          numUpvotes: numUpvotes,
          question: question,
        });
        this.crawlAllUrls(allUrls);
      }).then(() => this.state.finishCrawlingUrl(id));
    });
  }

  crawlAllUrls(allUrls) {
    allUrls.forEach((url) => {
      this.crawlUrl(url);
    });
  }

  _updateRefCount() {
    if (QuestionModel.queueCount !== 0) {
      setTimeout(() => this._updateRefCount(), 1000);
    } else {
      for (const ele in this.state.visitedUrls) {
        QuestionModel.updateRefCount(ele, this.state.visitedUrls[ele]);
      }
      this.tempState = 1;
    }
  }

  _writeToCSV() {
    if (this.tempState !== 1 || QuestionModel.queueCount !== 0) {
      setTimeout(() => this._writeToCSV(), 1000);
    } else {
      QuestionModel.writeToCSV();
      this.tempState = -1;
    }
  }

  finishCrawling() {
    console.log("Stopping Execution...");
    this.executor.stopExecution();
    this._updateRefCount();
    this._writeToCSV();
  }
}

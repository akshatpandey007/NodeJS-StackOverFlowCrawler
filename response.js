import cheerio from "cheerio";
import { urlConfig } from "./config.js";

export default class Response {
  constructor({ htmlPage, isQuestionPage = true }) {
    this.$ = cheerio.load(htmlPage);
    this.isQuestionPage = isQuestionPage;
  }

  findAllLinks(startsWith = "/questions") {
    const Id = !this.isQuestionPage
      ? urlConfig.getUniqueId(
          this.$("div#question-header > h1 > a.question-hyperlink").attr("href")
        )
      : -1;

    let temp = [];
    this.$("a").each((i, link) => {
      if (
        link &&
        link.attribs.href &&
        link.attribs.href.startsWith(startsWith) &&
        urlConfig.getFullUrl().length < link.attribs.href.length &&
        !isNaN(urlConfig.getUniqueId(link.attribs.href)) &&
        urlConfig.getUniqueId(link.attribs.href) !== Id
      )
        temp.push(urlConfig.nomalizeUrl(link.attribs.href));
    });
    return temp;
  }

  findUpVotes() {
    if (!this.isQuestionPage) return 0;
    return this.$("div.js-vote-count").attr("data-value");
  }
  findAnswers() {
    if (!this.isQuestionPage) return 0;
    return this.$("h2.mb0").attr("data-answercount");
  }
  findQuestionText() {
    if (!this.isQuestionPage) return "";
    return this.$("div#question-header > h1 > a.question-hyperlink").text();
  }
}

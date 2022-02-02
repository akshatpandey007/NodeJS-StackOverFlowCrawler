import Crawler from "./crawler2.js";

const crawler = new Crawler({
  maxConcurrentRequests: 5,
});

const url = "https://stackoverflow.com/questions";

crawler.crawl(url);

process.on("SIGINT", function () {
  crawler.finishCrawling();
});

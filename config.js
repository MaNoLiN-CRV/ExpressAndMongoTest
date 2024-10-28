export class apiConfig {
  port = 3001;
  number = 1;
  url = "http://localhost:3000/";
  maxNodes = 3;
  // FIRST SERVER = TRUE
  startNode = false;

  constructor(port, url, maxNodes, startNode) {
    this.port = port;
    this.url = url;
    this.maxNodes = maxNodes;
    this.startNode = startNode;
    this.number = this.randomNumber();
  }

  randomNumber(params) {
    return (Math.floor(Math.random()) * 10) + 1
  }
}

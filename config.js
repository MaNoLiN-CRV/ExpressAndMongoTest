export default class ApiConfig {
  port = 3001;
  number = 1;
  url = "http://localhost:3000/";
  maxNodes = 3;
  // FIRST SERVER = TRUE
  startNode = false;
  /**
   * Configuration of the api
   * @param {*} port Port to listen
   * @param {*} url Next node url to connect
   * @param {*} maxNodes Max connection nodes (ex: 2, 3 )
   * @param {*} startNode Inital node (true or false)
   */
  constructor(port, url, maxNodes, startNode) {
    this.port = port;
    this.url = url;
    this.maxNodes = maxNodes;
    this.startNode = startNode;
    this.number = this.randomNumber();
  }

  randomNumber(params) {
    return (Math.floor(Math.random()) * 100) + 1
  }
}

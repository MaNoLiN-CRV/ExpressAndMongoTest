const express = require('express');
const { apiConfig } = require('./config');
const app = express().use(express.json());
const apiConfig = new apiConfig(3000, "http://localhost:3000/", 3 , false);
// Made by Manuel Cervantes 
const route = {
  stage : 0,
  numeros: new Array, 
  stage: new Array
}

/**
 * Post method handling
 */
app.post('/', (req, res) => {
  let body = req.body;
  route.numeros.push(...body.numeros);  
  send(apiConfig.url,route,res);
});

/**
 * Sends a json object
 * @param {*} url Next node url
 * @param {*} json Json object to send to the next node
 * @returns The json object recived
 */
async function sendAndReciveJSON(url,json) {
  fetch(url,
    { 
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
      method:"POST",body:JSON.stringify(json)})
  .then(
    jsonParsed = response.json(),
  console.log("Error")
)
  .then(jsonParsed => {
    return jsonParsed;
  });
}
  /**
   * Sends the json object to the next node and waits if exists.
   * If not exists , only sends the json object to the previous node.
   * @param {*} url Next node url
   * @param {*} json Json object
   * @param {*} res Server response variable
   */
function send(url , json , res) {
  if (json.numeros.length != apiConfig.maxNodes ){
    json = sendAndReciveJSON(url,json);
  } 
  res.send(JSON.stringify(json));
}

app.listen(apiConfig.port, () => {
  console.log(`Listening in port ${port}`)
})

(() => {
  route.numeros.push(apiConfig.number);
  if (apiConfig.startNode){
    let json = sendAndReciveJSON(apiConfig.url, route);
    console.log("JSON: " + json.numeros);
  }
})();




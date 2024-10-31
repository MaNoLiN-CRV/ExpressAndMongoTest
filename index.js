import express, { json as _json } from 'express';
import ApiConfig from './config.js';
import Database from './Database.js';
const app = express().use(_json());
const apiConfig = new ApiConfig(2999, "http://localhost:3000/", 3 , true);
const database = new Database("mongodb+srv://manoliin27:EW8s1J71GNRaosSg@cluster0.hgo7x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
// Made by the incredible Manuel Cervantes 
const route = {
  stage : 1,
  numbers: new Array, 
  stamp: new Array
}
// BUSCAR LOS OBJETOS QUE CONTENGAN UN NÚMERO EN EL ARRAY
app.get("/find/:number",async (req,res) => {
  let numberFind = parseInt(req.params.number);
  const result = await database.readObjectByValue({ numbers: numberFind });
  res.send(result);
});

/**
 * Post method handling
 */
app.post('/', (req, res) => {
  let body = req.body;
  // CHECKS IF THE OBJECT IS CORRECTLY FORMED
  if (checkObject(body)){
    // ADD THE RECIVED DATA TO OUR ROUTE OBJECT
    route.numbers.push(...body.numbers);
    route.stamp.push(...body.stamp);  
    route.stage = body.stage + 1;
    // ADD THE STAMP
    route.stamp.push(Date.now());
    send(apiConfig.url,route,res);
  }
  else {
    res.status(403);
    res.send("MALFORMED OBJECT DETECTED");
  }
  
});

/**
 * Checks if the object is correct
 * @param {*} object object to check
 * @returns true or false
 */
function checkObject(object){
  let dev = false;
  if (('stage' in object) && ('numbers' in object) && ('stamp' in object)) {
    dev = true
  }
  return dev;
}

/**
 * Sends a json object
 * @param {*} url Next node url
 * @param {*} json Json object to send to the next node
 * @param {*} response response
 * @returns The json object recived (Promise)
 */
function sendAndReciveJSON(url,json) {
  console.log("SENDING TO " + url)
  return fetch(url,
    { 
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
      method:"POST",body:JSON.stringify(json)})
  .then((response) => {
    return response.json()},
  () => {
    console.log("Error");
  } 
  );
}


  /**
   * Sends the json object to the next node and waits if exists.
   * If not exists , only sends the json object to the previous node and inserts it into the database.
   * @param {*} url Next node url
   * @param {*} json Json object
   * @param {*} res Server response variable
   */
async function send(url , json , res) {
  if (json.stage != apiConfig.maxNodes ){
    sendAndReciveJSON(url,json).then((jsonRecived) => {
      res.send(JSON.stringify(jsonRecived));
    });
  }
  else {
    await database.insertObject(json);
    res.send(JSON.stringify(json));
  }
  //RESETS THE ROUTE OBJECT
  route.numbers.length = 1;
  route.stamp.length = 0; 

}


(() => {
  route.numbers.push(apiConfig.number);
  database.selectDatabaseAndCollection("Prueba", "numeros");
  if (apiConfig.startNode){
    route.stamp.push(Date.now());
    sendAndReciveJSON(apiConfig.url, route).then((jsonRecived) => {
      console.log("FINAL JSON RECIVED: " + JSON.stringify(jsonRecived));
    });
    
  }
  //ONLY STARTS A SERVER IF WE ARE NOT THE CLIENT
  else {
    app.listen(apiConfig.port, () => {
      console.log(`Listening in port ${apiConfig.port}`)
    })
  }
})();

/*

COMMAND OBJECTS

*/

const cmdStatus = {
  NONE: "none",
  INPROGRESS: "inprogress",
  ERROR: "error",
  SUCCESSFUL: "successful"
}

const cmdType = {
  NONE: "none",
  PROKKA: "prokka",
  ROARY: "roary",
  ROARY_PLOTS: "roary_plots",
  CLOUD_CORE_SHELL: "cloud_core_shell",
  QUERY_PAN_GENOME: "query_pan_genome"
}

class cmd {
  output = Array();
  command = "";
  commandType = cmdType.NONE;
  status = cmdStatus.NONE;
  outputFolder = "";
  commandID = "";
  
  constructor(command, commandType, status, outputFolder) {
      this.command = command;
      this.commandType = commandType;
      this.status = status;
      this.outputFolder = outputFolder;
  }

  addOutput(outputLine) {
      this.output.push(outputLine);
  }
}

/*

REQUIRED MODULES

*/

const express = require('express');
const multer = require('multer');
const uuid = require('uuid').v4;
const fs = require('fs');
const e = require('express');
const { request } = require('http');
const bodyParser = require('body-parser');
const { exec, spawn } = require("child_process");
const fse = require("fs-extra");
const { dir } = require('console');
const archiver = require('archiver');
const path = require('path');


var currentCommand = new cmd("", cmdType.NONE, cmdStatus.NONE, "");

var urlencodedParser = bodyParser.urlencoded({ extended: false});
var jsonencodedParser = bodyParser.json();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads')
  },
  filename: (req, file, cb) => {
    const { originalname } = file;
    cb(null, `${originalname}`);
  }
});

const upload = multer({storage: storage, onFileUploadStart: function(file, req, res){  }});
const app = express();

app.use(express.static(__dirname + '/public/'));

/*

GET METHODS

*/

app.get('/', (req, res) => {
  fs.readFile('public/index.html',function (err, data){
    res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
    res.write(data);
    res.end();
  });
});

app.get('/download', (req, res) => {
  fs.readFile('public/download.html',function (err, data){
    res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
    res.write(data);
    res.end();
  });
});

app.get('/currentCommand', (req, res) => {
  fs.readFile('public/currentCommand.html',function (err, data){
    res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
    res.write(data);
    res.end();
  });
});

app.get('/roaryPlots', (req, res) => {
  fs.readFile('public/roaryPlots.html',function (err, data){
    res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
    res.write(data);
    res.end();
  });
});

app.get('/cloudCoreGenome', (req, res) => {
  fs.readFile('public/cloudCoreGenome.html',function (err, data){
    res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
    res.write(data);
    res.end();
  });
});

app.get('/queryPanGenome', (req, res) => {
  fs.readFile('public/queryPanGenome.html',function (err, data){
    res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
    res.write(data);
    res.end();
  });
});

app.get('/getCurrentCommand', (req, res) => { 

  //name, uuid, dateAdded
  /*
  output = Array();
  command = "";
  commandType = cmdType.NONE;
  status = cmdStatus.NONE;
  */

  

  var jsonFiles = {command: currentCommand.command, commandType: currentCommand.commandType.toString(), status: currentCommand.status.toString(), outputFolder: currentCommand.outputFolder, output: currentCommand.output};

  res.json(jsonFiles);
  res.end();
});

app.get('/files', (req, res) => {
  const uploadFolder = __dirname + '/public/uploads/';

  //name, uuid, dateAdded

  var jsonFiles = [];

  fs.readdirSync(uploadFolder).forEach(file => {
    var fileEnd = file.slice(file.indexOf('_') + 1);
    var fileBeginning = file.slice(0, file.indexOf('_'));
    var stats = fs.statSync(uploadFolder + file);
    var mtime = stats.mtime.toLocaleTimeString();
    var mdate = stats.mtime.toLocaleDateString();
    jsonFiles.push({name: fileEnd, uuid: fileBeginning, dateAdded: mdate + " " + mtime});
  });

  res.json(jsonFiles);
  res.end();
});

app.get('/commands', (req, res) => {
  const outputFolder = __dirname + '/public/output/';

  //commandType, commandID, dateExecuted

  var jsonFiles = [];

  fs.readdirSync(outputFolder).forEach(file => {
    console.log(`Command Status: ${currentCommand.status}, Command Name: ${currentCommand.outputFolder.toLowerCase()}, File: ${file.toLowerCase()}`)
    if (((currentCommand.status == cmdStatus.ERROR || currentCommand.status == cmdStatus.INPROGRESS) && (file.toLowerCase() == currentCommand.outputFolder.toLowerCase()))) {
      //skip the command
    } else {
      var fileEnd = file.slice(file.indexOf('_') + 1);
      var fileBeginning = file.slice(0, file.indexOf('_'));
      var stats = fs.statSync(outputFolder + file);
      var mtime = stats.mtime.toLocaleTimeString();
      var mdate = stats.mtime.toLocaleDateString();
      jsonFiles.push({commandID: fileEnd, commandType: fileBeginning, dateExecuted: mdate + " " + mtime});
    }
  });

  res.json(jsonFiles);
  res.end();
});

app.get('/prokka', (req, res) => {
  fs.readFile('public/prokka.html',function (err, data){
    res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
    res.write(data);
    res.end();
  });
});

app.get('/roary', (req, res) => {
  fs.readFile('public/roary.html',function (err, data){
    res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
    res.write(data);
    res.end();
  });
});

app.get('/upload', (req, res) => {
  fs.readFile('public/upload.html',function (err, data){
    res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
    res.write(data);
    res.end();
  });
});

app.get('/uploadComplete', (req, res) => {
  fs.readFile('public/uploadcomplete.html',function (err, data){
    res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
    res.write(data);
    res.end();
  });
});

app.get('/delete', (req, res) => {

  fs.readFile('public/deleteComplete.html',function (err, data){
    res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
    res.write(data);
    res.end();
  });
});

app.get('/filesDeleted', (req, res) => {
  var localFiles = []; 
  if (Array.isArray(filesDeleted.selectBox)){
    (filesDeleted.selectBox).forEach(element => {
      localFiles.push(element.slice(element.indexOf('_') + 1));
    });
  } else {
    localFiles.push(filesDeleted.selectBox.slice(filesDeleted.selectBox.indexOf('_') + 1));
  }
  res.json(localFiles);
  res.end();
});


/*

POST METHODS

*/

var filesDeleted = {};

app.post('/delete', urlencodedParser, (req, res) => {
  fs.readFile('public/deleteComplete.html',function (err, data){
    res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
    res.write(data);
    res.end();
  });
  filesDeleted = req.body;
  let itemsDeleted = [];
  if (Array.isArray(filesDeleted.selectBox)){
    (filesDeleted.selectBox).forEach(element => {
      itemsDeleted.push(element);
    });
  } else {
    itemsDeleted.push(filesDeleted.selectBox);
  }

  itemsDeleted.forEach(deletedItem => {
    const path = __dirname + '/public/uploads/' + deletedItem;

    fs.unlink(path, (err) => {
      if (err) {
        console.error(err)
        return
      }
    })
  });
});

app.post('/download', urlencodedParser, (req, res) => {
  console.log(req.body);
  
  var fileDownloaded = req.body;
  let itemDownloaded = fileDownloaded.selectBox;
  let itemPath = __dirname + "/public/output/" + itemDownloaded + ".zip";
  let dir = __dirname + "/public/output/" + itemDownloaded;


  const command = `zip -r ${itemPath} ${dir}`
  const split = command.split(" ");
  const cmdWithoutArg = split[0];
  split.shift();

  const commandOut = spawn(cmdWithoutArg, split);
  commandOut.on('exit', (code) => {
    console.log(`childprocess close all stdio with code ${code}`)
    itemToBeDownloaded = path.join("/public/output/", itemDownloaded) + ".zip";
    itemToBeDownloadedDir = path.join("/public/output/", itemDownloaded) + "/";
    res.redirect(301, "/downloadFile");
    res.end();
  });
});

var itemToBeDownloaded = ""
var itemToBeDownloadedDir = ""

app.get('/downloadFile', (req, res) => {
  res.download(path.join(__dirname, itemToBeDownloaded), (err)=>{
    console.log("finished");
    if (!err) {
      fs.unlink(path.join(__dirname, itemToBeDownloaded), (err) => {
        if (err) {
          console.error(err)
        }
      })
      fs.rmdir(path.join(__dirname, itemToBeDownloadedDir), { recursive: true }, (err) => {
        if (err) {
          console.error(err)
          return;
        }
        console.log(`${itemToBeDownloadedDir} is deleted!`);
      });
    }
  });
})

app.post('/upload', upload.array('pangenomeFile'), (req, res) => {
  res.redirect(301, "/uploadComplete");
  res.end();
});

app.post('/uploadFailed', jsonencodedParser, (req, res) => {
  filesToDelete = req.body
  for (let i = 0; i < filesToDelete.length; i++) {
    const element = filesToDelete[i];
    const path = __dirname + '/public/uploads/' + element;

    fs.unlink(path, (err) => {
      if (err) {
        console.error(err)
        return
      }
    })
  }
  res.end();
});

app.post('/prokka', jsonencodedParser, (req, res) => {

  if (currentCommand.status == cmdStatus.INPROGRESS) {
    res.status(500).send();
    res.end();
    return;
  }
  var formData = (req.body);
  console.log(formData);
  const commandName = "prokka" + "_" + uuid();
  const directory = __dirname + "/public/output/" + commandName

  var command = `/home/josh/prokka/bin/prokka --outdir ${directory} `;

  for (var key in formData) {
    if (key.includes("contig")) {
      const path = __dirname + '/public/uploads/' + formData[key];
      command += path + " ";
    } else {
      if (formData.hasOwnProperty(key)) {
        command += "--" + key + " " + formData[key] + " ";
      } else {
        command += "--" + key + " ";
      }
    }
  }

  currentCommand = new cmd(command, cmdType.PROKKA, cmdStatus.INPROGRESS, commandName);

  executeCommand(command, "/home/josh/nodeJS/public/uploads");

  res.redirect(301, "/currentCommand");
  res.end();
});

app.post('/roary', jsonencodedParser, (req, res) => {

  if (currentCommand.status == cmdStatus.INPROGRESS) {
    res.status(500).send();
    res.end();
    return;
  }
  var formData = (req.body);
  console.log(formData);
  const commandName = "roary" + "_" + uuid();
  const directory = __dirname + "/public/output/" + commandName

  var command = `roary -v -f ${directory} `;

  for (var key in formData) {
    if (formData.hasOwnProperty(key)) {
      command += "-" + key + " " + formData[key] + " ";
    } else {
      command += "-" + key + " ";
    }
  }


  command += " *.gff"

  currentCommand = new cmd(command, cmdType.ROARY, cmdStatus.INPROGRESS, commandName);
  executeCommand(command, "/home/josh/nodeJS/public/uploads");

  res.redirect(301, "/currentCommand");
  res.end();
});

app.post('/roaryPlots', jsonencodedParser, (req, res) => {

  if (currentCommand.status == cmdStatus.INPROGRESS) {
    res.status(500).send();
    res.end();
    return;
  }

  var formData = (req.body);
  console.log(formData);
  const commandName = "RoaryPlots" + "_" + uuid();
  const directory = __dirname + "/public/output/" + commandName

  fse.copy("/home/josh/roaryplots", directory, function (err) {
    if (err){
        console.log('An error occured while copying the folder.')
        return console.error(err)
    }
    console.log('Copy completed!')

    const files = [directory, (directory + "/roary.html"), (directory + "/roary_plots.ipynb"), (directory + "/roary_plots.py"), (directory + "/roary_files"), (directory + "/roary_files/jquery.min.js"), (directory + "/roary_files/MathJax.js"), (directory + "/roary_files/require.min.js")]

    files.forEach(element => {
      fs.chmodSync(element, 0o777);
    });
    var command = `python3 ${directory + "/roary_plots.py"} ${__dirname}/public/uploads/${formData["newick"]} ${__dirname}/public/uploads/${formData["gpa"]}`;
    
    
    
    currentCommand = new cmd(command, cmdType.ROARY_PLOTS, cmdStatus.INPROGRESS, commandName)
    executeCommand(command, "/home/josh/nodeJS/public/uploads");
    res.redirect(301, "/currentCommand");
    res.end();
  });
});

app.post('/cloudCoreGenome', jsonencodedParser, (req, res) => {

  if (currentCommand.status == cmdStatus.INPROGRESS) {
    res.status(500).send();
    res.end();
    return;
  }

  var formData = (req.body);
  console.log(formData);
  const commandName = "CloudCoreShell" + "_" + uuid();
  const directory = __dirname + "/public/output/" + commandName

  var command = `python3 /home/josh/cloudCoreGenome/read_fasta.py ${__dirname}/public/uploads/${formData["pg"]} ${__dirname}/public/uploads/${formData["gpa"]} ${directory}`;

  currentCommand = new cmd(command, cmdType.CLOUD_CORE_SHELL, cmdStatus.INPROGRESS, commandName);

  fs.mkdirSync(directory);
  fs.chmodSync(directory, 0o777);

  executeCommand(command, "/home/josh/nodeJS/public/uploads");

  res.redirect(301, "/currentCommand");
  res.end();
});

app.post('/queryPanGenome', jsonencodedParser, (req, res) => {

  if (currentCommand.status == cmdStatus.INPROGRESS) {
    res.status(500).send();
    res.end();
    return;
  }

  var formData = (req.body);
  console.log(formData);
  const commandName = "QueryPanGenome" + "_" + uuid();
  const directory = __dirname + "/public/output/" + commandName
  const uploadFolder = __dirname + '/public/uploads/';
  var command = `query_pan_genome -v`;

  var files = []

  if (formData["firstSelectedFile"] && formData["firstSelectedFile"]) {
    const firstFileSet = formData["firstSelectedFile"].split(",");
    const secondFileSet = formData["secondSelectedFile"].split(",");
    firstFileSet.forEach(element => {
        fse.copySync(uploadFolder + element, directory + "/" + element)
        files.push(directory + "/" + element)
    });
    secondFileSet.forEach(element => {
      fse.copySync(uploadFolder + element, directory + "/" + element)
      files.push(directory + "/" + element)
    });
    command += ` -i ${formData["firstSelectedFile"]} -t ${formData["secondSelectedFile"]} `
  } else {
    fs.readdirSync(uploadFolder).forEach(file => {
      if (file.includes(".gff")) {
        files.push(directory + "/" + file)
        fse.copySync(uploadFolder + file, directory + "/" + file)
      }
    });
    command += ` ${directory}/*.gff `
  }

  for (var key in formData) {
    if (!key.includes("SelectedFile")) {
      command += "-" + key + " " + formData[key] + " ";
    }
  }

  files.forEach(element => {
    fs.chmodSync(element, 0o777);
  });

  

  currentCommand = new cmd(command, cmdType.QUERY_PAN_GENOME, cmdStatus.INPROGRESS, commandName);
  executeCommand(command, directory);
  res.redirect(301, "/currentCommand");
  res.end();
});

function executeCommand(commandToExecute, currentWorkDirectory) {
  const split = commandToExecute.split(" ");
  const cmdWithoutArg = split[0];
  split.shift();

  const commandOut = spawn(cmdWithoutArg, split, {cwd: currentWorkDirectory });
  commandOut.on('exit', (code) => { 
    console.log("exit BOI " + code)
    if (code == 0) {
      currentOutput = currentCommand.output
      currentCommand = new cmd(currentCommand.command, currentCommand.commandType, cmdStatus.SUCCESSFUL, currentCommand.outputFolder)
      currentCommand.output = currentOutput
    } else {
      currentOutput = currentCommand.output
      currentCommand = new cmd(currentCommand.command, currentCommand.commandType, cmdStatus.ERROR, currentCommand.outputFolder)
      currentCommand.output = currentOutput
    }
  })

  commandOut.stdout.on('data', (data) => {
    currentCommand.addOutput(data)
  });
  
  commandOut.stderr.on('data', (data) => {
    currentCommand.addOutput("ERROR: " + data)
  });
}

app.use(function(req, res, next) {
    res.status(404).send("That page doesn't exist.");
});

app.listen(8080, () => console.log('Pangenome Server Started On Port 8080.'));

/*
Things left to do:
NONE!!
*/
window.onload = getCommands();

var resultMemory = [];

function getCommands(){
    const promise = fetch('/commands');
  
    promise.then(response => {
        if(!response.ok){
            console.error(response);
        } else {
          return response.json();
        }
    }).then(result => {
      console.log(result);
      //commandType, commandID, dateExecuted
      resultMemory = result;
      let myTable = document.querySelector('#table');
      let headers = ['Select', 'Command Name', 'Command Unique ID', 'Execution Date'];
      let table = document.createElement('table');
      let headerRow = document.createElement('tr');
      
      headers.forEach(headerText => {
        let header = document.createElement('th');
        header.className = "thfiles";
        let textNode = document.createTextNode(headerText);
        header.appendChild(textNode);
        headerRow.appendChild(header);
      });
      table.appendChild(headerRow);
      var i = 0;
      result.forEach(file => {
        let row = document.createElement('tr');
        let selectCell = document.createElement('td');
        selectCell.className = "tdfiles";
        let selectBox = document.createElement('input');
        selectBox.type = "checkbox";
        selectBox.id = "selectBox" + i;
        selectBox.name = "selectBox";
        selectBox.className = "selectBox";
        selectBox.value = file['commandType'] + "_" + file['commandID'];
        selectCell.appendChild(selectBox);
        row.appendChild(selectCell);
  
        let nameCell = document.createElement('td');
        nameCell.className = "tdfiles";
        let nameTextNote = document.createTextNode(file['commandType']);
        nameCell.appendChild(nameTextNote);
        row.appendChild(nameCell);
  
        let uuidCell = document.createElement('td');
        uuidCell.className = "tdfiles";
        let uuidCellTextNote = document.createTextNode(file['commandID']);
        uuidCell.appendChild(uuidCellTextNote);
        row.appendChild(uuidCell);
  
        let dateCell = document.createElement('td');
        dateCell.className = "tdfiles";
        let dateTextNote = document.createTextNode(file['dateExecuted']);
        dateCell.appendChild(dateTextNote);
        row.appendChild(dateCell);
        table.appendChild(row);
        i++;
      });
  
      myTable.appendChild(table);
    });
  }

function validate(form) {
    let selectBoxes = document.querySelectorAll('input[type="checkbox"]');
    var oneSelected = false;
    var multipleSelected = false;
    selectBoxes.forEach(element => {
        if (element.checked) {
          if (oneSelected) {
            multipleSelected = true;
          }
          oneSelected = true;
        }
    });
    
    if (multipleSelected) {
      alert('Please select only one command to download!');
      return false;
    }

    if(oneSelected) {
        return confirm('Do you really want to download the selected command outputs? NOTE: Doing so will delete the command from the server.');
    }
    else {
        alert('Please select one command to download!');
        return false;
    }
}
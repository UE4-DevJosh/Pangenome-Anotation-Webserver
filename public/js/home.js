window.onload = getFiles();

var resultMemory = [];

function getFiles(){
    const promise = fetch('/files');
  
    promise.then(response => {
        if(!response.ok){
            console.error(response);
        } else {
          return response.json();
        }
    }).then(result => {
      console.log(result);
      
      resultMemory = result;
      let myTable = document.querySelector('#table');
      let headers = ['Select', 'File Name', 'File Unique ID', 'Upload Date'];
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
        selectBox.value = file['uuid'] + "_" + file['name'];
        selectCell.appendChild(selectBox);
        row.appendChild(selectCell);
  
        let nameCell = document.createElement('td');
        nameCell.className = "tdfiles";
        let nameTextNote = document.createTextNode(file['name']);
        nameCell.appendChild(nameTextNote);
        row.appendChild(nameCell);
  
        let uuidCell = document.createElement('td');
        uuidCell.className = "tdfiles";
        let uuidCellTextNote = document.createTextNode(file['uuid']);
        uuidCell.appendChild(uuidCellTextNote);
        row.appendChild(uuidCell);
  
        let dateCell = document.createElement('td');
        dateCell.className = "tdfiles";
        let dateTextNote = document.createTextNode(file['dateAdded']);
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
    selectBoxes.forEach(element => {
        if (element.checked) {
            oneSelected = true;
        }
    });
    
    if(oneSelected) {
        return confirm('Do you really want to delete the selected files?');
    }
    else {
        alert('Please select at least one file to delete!');
        return false;
    }
}
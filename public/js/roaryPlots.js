var resultMemory = [];

window.onload = function (e) {
  var newickFileSelect = document.getElementById('newickText');
  var genePresenceAbsenceFileSelect = document.getElementById('genePresenceAbsenceText');
  const promise = fetch('/files');
  
    promise.then(response => {
        if(!response.ok){
            console.error(response);
        } else {
          return response.json();
        }
    }).then(result => {      
      resultMemory = result;
      resultMemory.forEach(e => {
        var selectOption = document.createElement('option');
        selectOption.value = e['uuid'] + "_" + e['name'];
        selectOption.textContent = e['name'];

        if (e['name'].includes(".csv")) {
          genePresenceAbsenceFileSelect.appendChild(selectOption);
        } else if (e['name'].includes(".tre")) {
          newickFileSelect.appendChild(selectOption);
        }
      });
    })
};

document.getElementById("roaryPlotsForm").addEventListener('submit', function (event) {

	event.preventDefault();

  const form = document.getElementById('roaryPlotsForm');
  var formInfo = (new FormData(form));
  var formObject = {};
  var newickFileSelect = document.getElementById('newickText');
  var gpaFileSelect = document.getElementById('genePresenceAbsenceText');

  var newickFileName = "";
  try {
    newickFileName = newickFileSelect.options[newickFileSelect.selectedIndex].value;
  } catch (error) {
    alert("You must upload then select a Newick Tree file!") 
    return;
  }

  var gpaFileName = "";
  try {
    gpaFileName = gpaFileSelect.options[gpaFileSelect.selectedIndex].value;
  } catch (error) {
    alert("You must upload then select a Gene Presence Absence file!") 
    return;
  }

  formObject["newick"] = newickFileName;
  formObject["gpa"] = gpaFileName;

  var formJSON = JSON.stringify(formObject);
  console.log(formJSON);

	fetch('/roaryPlots', {
		method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
		body: formJSON
	}).then(function(res) {
    if (res.status == 500) {
      alert("There is already a command in progress!");
    } else {
      window.location.href = 'currentCommand'
    }
  })
});
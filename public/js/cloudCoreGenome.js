var resultMemory = [];

window.onload = function (e) {
  var panGenomeFileSelect = document.getElementById('panGenomeText');
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
        } else if (e['name'].includes(".fa")) {
          panGenomeFileSelect.appendChild(selectOption);
        }
      });
    })
};

document.getElementById("cloudCoreGenomeForm").addEventListener('submit', function (event) {

	event.preventDefault();

  const form = document.getElementById('cloudCoreGenomeForm');
  var formInfo = (new FormData(form));
  var formObject = {};
  var gpaFileSelect = document.getElementById('genePresenceAbsenceText');
  var panGenomeSelect = document.getElementById('panGenomeText');

  var gpaFileName = "";
  try {
    gpaFileName = gpaFileSelect.options[gpaFileSelect.selectedIndex].value;
  } catch (error) {
    alert("You must upload then select a Gene Presence Absence file!") 
    return;
  }

  var panGenomeFileName = "";
  try {
    panGenomeFileName = panGenomeSelect.options[panGenomeSelect.selectedIndex].value;
  } catch (error) {
    alert("You must upload then select a Pan Genome Reference file!") 
    return;
  }

  formObject["gpa"] = gpaFileName;
  formObject["pg"] = panGenomeFileName;

  var formJSON = JSON.stringify(formObject);
  console.log(formJSON);

	fetch('/cloudCoreGenome', {
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
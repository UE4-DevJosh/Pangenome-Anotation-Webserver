var resultMemory = [];

window.onload = function (e) {
  document.getElementById('locusTagText').value = "PROKKA";
  document.getElementById('incrementText').value = "1";
  document.getElementById('gffVerText').value = "3";
  document.getElementById('genusText').value = "Genus";
  document.getElementById('speciesText').value = "species";
  document.getElementById('strainText').value = "strain";
  document.getElementById('kingdomText').selectedIndex = 1;
  document.getElementById('gcodeText').value = "0";
  document.getElementById('cpusText').selectedIndex = 6; 
  document.getElementById('minContiglenText').value = "1";
  document.getElementById('evalueText').value = "0.000001";
  var contigsFileSelect = document.getElementById('contigsText');
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
        contigsFileSelect.appendChild(selectOption);
      });
    })
};

document.getElementById("prokkaForm").addEventListener('submit', function (event) {

	event.preventDefault();

  const form = document.getElementById('prokkaForm');
  var formInfo = (new FormData(form));
  var formObject = {};
  var contigsFileSelect = document.getElementById('contigsText');

  var fileName = "";
  try {
    fileName = contigsFileSelect.options[contigsFileSelect.selectedIndex].value;
  } catch (error) {
    alert("You must upload then select a contig file!") 
    return;
  }

  formObject["contig"] = fileName;

  formInfo.forEach(function(value, key){
    if (!key.includes("Text")) {
        if (document.getElementById(value + "Text") != null) {
          formObject[key] = document.getElementById(value + "Text").value;
        } else {
          formObject[key] = "";
        }
    }
  });
  var formJSON = JSON.stringify(formObject);
  console.log(formJSON);

	fetch('/prokka', {
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
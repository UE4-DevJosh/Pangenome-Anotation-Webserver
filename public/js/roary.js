window.onload = function (e) {
  document.getElementById('pText').selectedIndex = 0;
  document.getElementById('oText').value = "clustered_proteins";
  document.getElementById('iText').value = "95";
  document.getElementById('cdText').value = "99";
  document.getElementById('bText').value = "blastp";
  document.getElementById('cText').value = "mcl";
  document.getElementById('dText').value = "mcxdeblast";
  document.getElementById('gText').value = "50000";
  document.getElementById('mText').value = "makeblastdb";
  document.getElementById('tText').value = "11";
  document.getElementById('ivText').value = "1.5";
};

document.getElementById("roaryForm").addEventListener('submit', function (event) {

	event.preventDefault();

  const form = document.getElementById('roaryForm');
  var formInfo = (new FormData(form));
  var formObject = {};

  formInfo.forEach(function(value, key){
    if (!key.includes("Text")) {
      console.log(key + " : " + value)
      if (document.getElementById(key + "Text") != null) {
        formObject[key] = document.getElementById(key + "Text").value;
      } else {
        formObject[key] = "";
      }
    }
  });
  var formJSON = JSON.stringify(formObject);
  console.log(formJSON);

	fetch('/roary', {
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
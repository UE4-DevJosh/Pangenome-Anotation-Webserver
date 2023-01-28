var resultMemory = [];

window.onload = function (e) {
  var firstFileSelect = document.getElementById('iText');
  var secondFileSelect = document.getElementById('tText');
  const promise = fetch('/files');
  
    promise.then(response => {
        if(!response.ok){
            console.error(response);
        } else {
          return response.json();
        }
    }).then(result => {      
      resultMemory = result;
      console.log(result)
      resultMemory.forEach(e => {
        var selectOptionOne = document.createElement('option');
        selectOptionOne.value = e['uuid'] + "_" + e['name'];
        selectOptionOne.textContent = e['name'];
        var selectOptionTwo = document.createElement('option');
        selectOptionTwo.value = e['uuid'] + "_" + e['name'];
        selectOptionTwo.textContent = e['name'];

        if (e['name'].includes(".gff")) {
          firstFileSelect.appendChild(selectOptionOne);
          secondFileSelect.appendChild(selectOptionTwo);
        }
      });
    })
};

document.getElementById("queryPanGenomeForm").addEventListener('submit', function (event) {

	event.preventDefault();

  const form = document.getElementById('queryPanGenomeForm');
  var formInfo = (new FormData(form));
  var formObject = {};
  var firstFileSelect = document.getElementById('iText');
  var secondFileSelect = document.getElementById('tText');
  var actionSelect = document.getElementById("aText");

  if (!document.getElementById("a").checked) { 
    alert("You must select an action!");
    return;
  }

  console.log(document.getElementById("i").checked + " i")
  console.log(document.getElementById("t").checked + " t")
  console.log(document.getElementById("n").checked + " n")

  if (actionSelect.options[actionSelect.selectedIndex].value.includes("difference")) {
    if ((document.getElementById("i").checked && document.getElementById("t").checked)&& !document.getElementById("n").checked) {
      
      var firstSelected = getSelectValues(firstFileSelect);
      var secondSelected = getSelectValues(secondFileSelect);
      if (firstSelected.length == 0 || secondSelected.length == 0) {
        alert("To use the 'Difference' Action, you must select at least one first and one second comparison .gff file.")
        return;
      }
      var firstSelectedText = ""
      firstSelected.forEach(e => {
        firstSelectedText += e + ","
      });

      var secondSelectedText = ""
      secondSelected.forEach(e => {
        secondSelectedText += e + ","
      });

      formObject["firstSelectedFile"] = firstSelectedText.slice(0, -1);
      formObject["secondSelectedFile"] = secondSelectedText.slice(0, -1);
    } else {
      alert("To use the 'Difference' Action, you must select a first and second comparison set of .gff files.")
      return;
    }
  } else if (actionSelect.options[actionSelect.selectedIndex].value.includes("union") || 
                actionSelect.options[actionSelect.selectedIndex].value.includes("intersection") ||
                actionSelect.options[actionSelect.selectedIndex].value.includes("complement")) {
      if (document.getElementById("i").checked || document.getElementById("t").checked || document.getElementById("n").checked) {
        alert("To use the 'Union', 'Intersection', or 'Complement' Action, you must leave the last three options unchecked.")
        return;
      }
  } else if (actionSelect.options[actionSelect.selectedIndex].value.includes("gene_multifasta")) {
    if (document.getElementById("i").checked || document.getElementById("t").checked || !document.getElementById("n").checked) {
      alert("To use the 'Gene Multifasta' Action, you must leave the last two options unchecked & you must select and fill in the option for the Gene Names.")
      return;
    }
  }

  formInfo.forEach(function(value, key){
    if (!key.includes("Text") && !key.includes("t") && !key.includes("i")) {
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

	fetch('/queryPanGenome', {
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

function getSelectValues(select) {
  var result = [];
  var options = select && select.options;
  var opt;

  for (var i=0, iLen=options.length; i<iLen; i++) {
    opt = options[i];

    if (opt.selected) {
      result.push(opt.value || opt.text);
    }
  }
  return result;
}
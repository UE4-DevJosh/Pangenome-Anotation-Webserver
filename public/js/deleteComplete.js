window.onload = getFilesDeleted();

function getFilesDeleted() {
    const promise = fetch('/filesDeleted');
  
    promise.then(response => {
        if(!response.ok){
            console.error(response);
        } else {
          return response.json();
        }
    }).then(deleted => {
        var header = document.querySelector("#items");
        deleted.forEach(deletedItem => {
          header.innerHTML += "- " + deletedItem + " <br>";
        });
    });
}
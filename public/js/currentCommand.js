window.onload = getCurrentCommand();

function getCurrentCommand() {
    const promise = fetch('/getCurrentCommand');
      
    promise.then(response => {
        if(!response.ok){
            console.error(response);
        } else {
            return response.json();
        }
    }).then(result => {
        console.log(result);
        var text = document.createElement('h3');
        var output = document.getElementById('output');
        if (result["commandType"] == 'none' || result["status"] == 'none') {
            text.innerText = "There is currently no command in progress.";
        } else {
            text.innerHTML += `Command ID: ${result["outputFolder"]} <br><br>`;
            text.innerHTML += `Command Type: ${result["commandType"]} <br><br>`;
            text.innerHTML += `Command: ${result["command"]} <br><br>`;
            text.innerHTML += `Status: ${result["status"]}`;

            if (Array.isArray(result["output"])){
                (result["output"]).forEach(element => {
                    output.innerHTML += `${element} <br>`
                });
            } else {
                output.innerHTML += `${result["output"]}`
            }

        }
        document.getElementById('other').appendChild(text);
    });
}
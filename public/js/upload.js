const form = document.getElementById('form');
const bar = document.getElementById('progress-bar');
var myCurrentData = [];
var currentPercentage = 0;
var uploadFinished = false;

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData();
    const file = document.getElementById('file');
    const img = file.files;

    if (img.length == 0) {
        alert("Please select a file first.");
        return;
    }

    for (let i = 0; i < img.length; i++) {
        const currentFile = new File([img[i]], uuidv4() + "_" + ((img[i].name).split('_').join('-')).split(' ').join('-'));
        formData.append('pangenomeFile', currentFile);
        myCurrentData.push(currentFile.name);
    }

    const config = {
        onUploadProgress: function(progressEvent) {
            const percentCompleted =  Math.trunc((progressEvent.loaded / progressEvent.total) * 100);
            currentPercentage = percentCompleted;
            bar.setAttribute('value', percentCompleted);
            bar.previousElementSibling.textContent = `${percentCompleted}%`
        }
    }

    axios.post('/upload', formData, config)
        .then(function(res) {
            uploadFinished = true
            window.location.href = 'uploadComplete'
        })
        .catch(err => console.log(err))
})

window.addEventListener('beforeunload', event => {
    if (uploadFinished) return;
     
    event.preventDefault()
    if (myCurrentData.length != 0) {
        if (currentPercentage != 100) {
            var formJSON = JSON.stringify(myCurrentData);

            fetch('/uploadFailed', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: formJSON
            });
        }
    }
    const confirmMessage = "If you leave the page before the upload is complete, it will be cancelled. Continue?";
    (event || window.event).returnValue = confirmMessage;
    return confirmMessage;
});
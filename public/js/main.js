function toggle(ele) {
    var id = ele.id;

    var x = document.getElementById(id + "Text");

    if (ele.checked) {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }
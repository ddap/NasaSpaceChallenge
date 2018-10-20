
$( "#reportForm" ).submit(function( event ) {
    getLocation();
    event.preventDefault();
});

function showPosition(position) {
    var pos = position;
    var d = new Date();
    var t = d.getTime();
    $.post( "http://localhost:1377/"+t+"/"+pos.coords.latitude+"/"+ pos.coords.longitude+"/"+ $( "#dang option:selected" ).text());

}
function getLocation() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
  } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];

    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {

            var tarr = [];
            for (var j=0; j<headers.length; j++) {
                tarr.push(headers[j]+":"+data[j]);
            }
            lines.push(tarr);
        }
    }
    alert(lines);
}

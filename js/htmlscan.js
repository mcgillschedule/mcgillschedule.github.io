window.onload = function() {

	//When the page is loaded create fileInput and display variable
	//initially empty
    var fileInput = document.getElementById('fileInput');
    var fileDisplayArea = document.getElementById('fileDisplayArea');

    //add an event listener, so when the fileInput variable changes
    //something happens i.e. when a file has been loaded do stuff
    fileInput.addEventListener('change', 
    	function(e) {
			var file = fileInput.files[0]; //fileInput is a "file" type DOM object which has an attribute files
			var textType = /text.*/;
			if (file.type.match(textType)) {
				var reader = new FileReader();
				//reader.onload is an event handler for the load event
				//load event is triggered every time the reading operation has successfully completed
				var data;
				reader.onload = function(e) {
					fileDisplayArea.innerText = data; //reader.result is the file contents, assign that to the fileDisplay area test
				}		
				//parse the html string right here
				reader.readAsText(file);
				var htmlString=reader.result;
				var parser=new DOMParser();
				var xmlDOM=parser.parseFromString(htmlString, "text/xml");
    			data= xmlDOM.getElementsByTagName("title")[0];
			} 
			else {
				fileDisplayArea.innerText = "File not supported!";
			}	
    	}
 	);

}
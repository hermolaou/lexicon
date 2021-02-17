
const path=chrome.runtime.getURL('data/adjectives.json' /* 'LiddellScott.xml'*/)

const myRequest = new XMLHttpRequest();
myRequest.addEventListener("loadend", function() {

	const adjs=JSON.parse(myRequest.responseText);

	const zwadjs=adjs.filter(a => a.lemma='λευκοστεφής');
	alert(JSON.stringify(zwadjs))

})

myRequest.open("get", path)
myRequest.send()

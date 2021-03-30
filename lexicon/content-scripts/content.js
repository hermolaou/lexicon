/*
	Glory to God in the highest as always.
*/ 

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	
	//alert(JSON.stringify(request))
	//alert(requeswhatToDo)

	switch(request.whatToDo)
	{
		case 'listWords':
			var words=(document.body.innerText);
			sendResponse(words);
			return

		case 'TurnMonotonic':
			
			// замена на правильный знак ударения. τὦ например неправильно заменяет. йоту подписную плохо заменяет.
			var replaced = $("body").html().normalize('NFD').replace(/[\u0300\u0342]/g, String.fromCharCode(0x0301)).
				replace(/[\u0302-\u0307\u0309-\u0343\u0345-\u036f]/g, '').normalize();

			$("body").html(replaced);
			return
		
		case 'getWordExamples':

	}

});

$( "body" ).dblclick(function() {
	if(document.activeElement.tagName=='INPUT' || document.activeElement.tagName=='TEXTAREA') return;
		
	var word=String(document.getSelection()).trim().normalize();
	if(!word.length) return;

	const context='surrounding sentence'
	
	chrome.runtime.sendMessage({todo:"wordstudy", word: word, context: context})
});
 

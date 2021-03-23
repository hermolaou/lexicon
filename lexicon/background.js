/* How can a script be complete without a doxologia to the Lord in the header???
*/

// требуется убирать в слове ударения.

// const url=chrome.runtime.getURL('popup/wordstudy.html?lemma=λήμμα&form=φόρμα');	
const url=chrome.runtime.getURL('popup/meanings.html?lemma=λήμμα&form=φόρμα');	
chrome.tabs.create({url: url})	

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	
	switch(request.todo)
	{
		case 'meanings':
			alert(request.word)
			break

		case 'wordstudy':
			//open our word page 
			
			//save context urrounding sentence in db or storage
			/*const html=WordStudy(request.word)			
			sendResponse(html)*/

			//open modern Greek
			var word=request.word
			if(word.length>=5)
			word=word.substr(0,word.length*2/3).normalize();

			var monotonic = word.normalize('NFD').replace(/[\u0300\u0342]/g, String.fromCharCode(0x0301)).
						replace(/[\u0302-\u0307\u0309-\u0343\u0345-\u036f]/g, '').normalize();

			var greeklangUrl=`http://greeklang.ru/?s=${word}&lookword=1`;
			//var wikilexicoUrl=`https://el.wiktionary.org/w/index.php?search=${word}`;
			
			var url = greeklangUrl
			// chrome.tabs.create({url: url});

			WordStudy(request.word);

	}
	

});



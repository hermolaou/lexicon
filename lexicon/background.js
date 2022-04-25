/* 
	How can a script be complete without a doxologia to the Lord in the header???
*/

// требуется убирать в слове ударения.

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	
	switch(request.todo)
	{
		case 'getMeanings':
			const q=(request.q)

			sendResponse(meanings.filter(m=>m[0].startsWith(q)))

			return

		case 'wordStudy':
			//open our word page 

			var word=GreekNormalize(request.word)

			//save context urrounding sentence in db or storage
			const html=WordStudy(word)			
			sendResponse(html)

			//open modern Greek
			if(word.length>=5)
			word=word.substr(0,word.length*2/3).normalize();

			var monotonic = word.normalize('NFD').replace(/[\u0300\u0342]/g, String.fromCharCode(0x0301)).
						replace(/[\u0302-\u0307\u0309-\u0343\u0345-\u036f]/g, '').normalize();

			var greeklangUrl=`http://greeklang.ru/?s=${word}&lookword=1`;
			//var wikilexicoUrl=`https://el.wiktionary.org/w/index.php?search=${word}`;
			
			var url = greeklangUrl
			// chrome.tabs.create({url: url});
	

	}
	

});



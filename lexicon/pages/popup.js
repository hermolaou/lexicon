/*
	How can a script be complete without a doxologia to the Lord in the header???
*/

//We are fortunate in gaining the experience that paradoxically the most beautiful and useful results
//can be achieved by just using the most simple means

$("textarea").on('input', function(){

	//send message 
	//if (st) clearTimeout (st);
	
	//st = setTimeout (function() {
		
	q=GreekNormalize(txtWords.value.normalize());

	//if select query entered try it

	if (q.match(/^[\u0300-\u03ff\u1f00-\u1fff\s]+$/))
	{
		//q=(String(q.match(/[\u0300-\u03ff\u1f00-\u1fff%_]+/)));
		
		//if (!q.match(/[%_]/)) q+='%';
		
		if (q.length<3) return
	
		setTimeout(chrome.runtime.sendMessage({todo:'getMeanings', q: q}, function(response){
			divResults.innerText=response.map((entry)=>{return entry[1]})
		}), 1200);
		
		
		/*
		var qs = [];
		
		function PopulateQueries(q) {
			qs.push(format("select * from meanings where lemma like '", q, "' order by lemma"));
			qs.push(format("select lemma, form, pos from lexicon where form = '", q,
							"' or lemma like '", q, "' order by lemma, form"));	
			qs.push ("select * from verbs where form like '" +q+"' or lemma like '"+q+"' order by lemma, form, tense, mood, voice, person, number");
			qs.push ( "select * from participles where form like '" +q+"' or lemma like '"+q+"' order by lemma, form, tense, voice, number, gender, case");
		}
		
		PopulateQueries(q);	
		

		if (q.match(/ῤῥ/))
			PopulateQueries(q.replace("ῤῥ", 'ρρ'))
		*/

		
		//divResults.innerHTML="";
		
		/*
		var outputData = function (rs, q) {
			if (rs.bof) {
				if (q.match('^select \\* from meanings where lemma')) {
					q=q.replace("lemma like '", "meaning like '%");

					SqlAsync(q, outputData);
				}
			} else {
				
				tbl=rsdisplay(rs);
				
				tbl.style.float="left";
				tbl.style.width="49%";
				divResults.appendChild (tbl);
			}		
		}
		SqlAsync(qs, outputData);
		*/
	
	//} else if (q.match(/^[\w\s]+$/)) {
		//if English then load it through xml right here
		//EnglishWordView
		
	}

})

//document.querySelector("table").innerHTML = html;
//what does this do

$("button").click(function (){
	var id=$(this).attr('id');

	//send message to background script
	const word=txtWords.value
	chrome.runtime.sendMessage({todo:'wordstudy', word: word}, function(response) {
		divResults.innerHTML="<table>" +response+"</table>";
	})

		
	//online study word. do command.
	function OnClickWordStudy()
	{
		//later hopefully to show the words right away.
					
		var words=txtWordsOrSql.value.match(/[\u0300-\u03ff\u1f00-\u1fffa-zA-Z]+/g)
		if (words)
			words.forEach(function(word) {
				//send message 
				
			});

	}

	
	//send message to content script
	/*chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {whatToDo: id}, function(response) {
		});
	});	*/
} );

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	return;
	chrome.tabs.sendMessage(tabs[0].id, {whatToDo: "listWords"}, function(response) {
		var words=response.match(/[\u0370-\u03ff\u1f00-\u1fff]+/gim).sort((a,b)=>a.localeCompare(b)).filter(word=>word.length>3);
		words = [...new Set(words)]
		
		document.body.appendChild(document.createElement("br"))
		document.body.appendChild(document.createTextNode("Слов: " + words.length))
		words.forEach(function(word){
			var p=document.createElement("p")
			p.innerText=word
			document.body.appendChild(p)
		});
			
		$( "p" ).dblclick(function() {
			var word=$(this).text();
			//if(!word.length) return;
				
			chrome.runtime.sendMessage(word)
			
		});

		$( "p" ).click(function() {
			var word=$(this).text();
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {whatToDo: "getWordExamples", word: word}, function(response) {
					
				})
			});
		})
	});
  });



function OnClickSqlCmd()
{	
	if (txtWordsOrSql.value.match(/^\w/)) { 
		
		cmd=ReplaceExtChars (txtWordsOrSql.value);
		if ( CheckDiacritics(cmd)) {
			alert ("The command has combined diacritics.");
			return;
		}
			
		if (!conn) SqlConnect (dbFile)
			
		tstamp=+ new Date;
		
		try {
			var rs=conn.execute(cmd);	//async maybe?
		} catch(err) {
			divResults.innerText=err.message;
			return;
		}
		
		qtime=+new Date-tstamp;
	
		divResults.innerHTml=""	
		if (rs.State) {
		
			tstamp=+new Date;
			
			tbl=rsdisplay(rs);	
			tbl.style.float="left";
			//rs.style.width="49%";
				
			//select count(*) from lexicon where form like 'ῥ'
			
			rs.close();
			rtime=+new Date-tstamp;
		
			divResults.innerText='';
			divResults.appendChild(tbl); //, divResults.firstChild);
			
			///divResults.innerText += "Query time:" + qtime + " Reading time:" +rtime;
			
		}
		

	}
}
/*
Function OnClickStatus()

	For Each elem In divSources.getelementsbytagname("iframe")
		
	'	elem.parentelement.style.display="block"
	'	
	'	echo elem.title, elem.contentLocation
	'	'SaveSetting "scrollX", elem.title, elem.contentWindow.pageXoffset
		'SaveSetting "scrollY", elem.title, elem.contentWindow.pageYoffset	
		'SaveSetting	"location", elem.src ...
	
	Next
	
	Set trTables=CreateHTMLElement("tr")
	Set trCounts=CreateHTMLElement("tr")
	
	SqlConnect dbFile
	
	Set adox = CreateObject("adox.catalog")
	adox.ActiveConnection= connStr
	
	For Each table In adox.Tables
		If strbegin(table.Name, "MSys")=false Then
			q="select count(1) from " & table.Name
			Set qrs=conn.Execute (q)
			count= qrs.Fields.Item(0)
			
			'echo table.Name, count
			trTables.appendChild CreateHTMLElement("th", table.Name)
			trCounts.appendChild CreateHTMLElement("td", CStr(count))
		End if
	Next

	Set adox=Nothing	
	divResults.appendChild trTables
	divResults.appendChild trCounts 	
		
'	If conn.State=adStateClosed Then conn.Open connStr
'	Set rs =conn.Execute("select * from Lexicon")
	
'	DisplayRS rs
'	rs.Close
			
End Function

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  	chrome.tabs.create({url: request.url});
});
*/


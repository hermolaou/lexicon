/*
	Glory In the highest To God
*/	

/* words to check
	οἰκείῳ
	запрос ἐφύ выявляет проблемы
	//για γλυφ δεν βρει γλυφή
καθὼς δεν αναγνωρίζεται για κάποια αιτία
	ἀρύω, χύδην   δεν ανοίγει, δεν δείχνει τη σημασία	


split data js into smal chunks + formsmeanings from goldendict

stripDiacritics. remove second stress regex.
live search amidst forms, show form descriptions
fixed wdidth popup like etymonline
popup box like in etymonline
 From Weissmann pages
sorting by clicking table. tenses or other stuff turn onoff
*/

//να αφειρεθούν οι περιττές χαρακτήρες που εμποδίζουν διπλό κλικ
//терпения мало, терпи и всё будет с Богом.

//στην πίνακα σαν χρόνο, έγκλιση, αριθμό, λεζάντα


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	
	if (request.todo!='getLemmaData') return;

	//πιστεύοντι in the forms list erroneous as verb

//function listener(request){	
	//get lemma forms	
	let lemmaForms=forms.filter(form => form.lemma==request.lemma).map(form => Object.assign({}, form));

	let poses=[], formsTables=[];
	lemmaForms.map((form) => poses[form.pos]=poses[form.pos] || {});

	let description="";

	Object.keys(poses).forEach((pos)=>{
		//grammar form descripton 
		description += [request.lemma, chrome.i18n.getMessage(pos)].join(" ")+
			"<br>"
		
		const posForms=lemmaForms.filter(f=>f.pos==pos);
		description+= request.form+" "+
			posForms.filter(f=>f.form==request.form).map(form=>{
				const formcopy=Object.assign({}, form);
				delete formcopy.pos;
				delete formcopy.lemma;
				delete formcopy.form;
				return Object.keys(formcopy).map((category) => 
					chrome.i18n.getMessage(category)+": "+ chrome.i18n.getMessage(form[category])
				).join(", ")
			}).join("<br>" +request.form+ " ")+"<br>";

		//forms table
		formsTables.push(GetFormsTable(posForms, request.form));

	});

	description=nl2br(description)

	//meaning from the dictinary
	const lemmaMeanings=nl2br(meanings.filter(m=>m[0] == request.lemma).flat().filter((meaning, index)=> index%2===1))

	//const examples	//from bookmarked sources and from internet
	
	sendResponse({description: description, meanings:lemmaMeanings, formsTables:formsTables})
	//	return {description: description, meanings:lemmaMeanings, formsTables:formsTables};
})
//}


function GetFormsTable(forms, form)
{
	const pos=forms[0].pos;
	const headers=
		{"verb":{
			rows:['tense', 'mood', 'person'],
			columns:['voice', 'number']},
		"part":{
			rows:['tense', 'voice', 'case'],
			columns :['number', 'gender']},
		'noun':{
			rows:['case'],
			columns :['number']},
		'adj':{
			rows:['case'],
			columns :['number' , 'gender']}
		}; // {extractor comparator};

	return pivotTable(forms, "form", headers[pos].rows, headers[pos].columns,
		//sort order
		{"tense":["pres", "imperf", "aor", "fut" , "perf"],
			"number": ["sg", "pl", "dual"],
			"person":["1st", "2nd", "3rd"],
			"voice":["act", "mp", "mid", "pass"],
			"mood":["ind", "subj", "opt", "imperat", "inf"],
			"case":["nom", "gen", "dat", "acc", "voc"],
			"gender":["masc", "fem", "neut"]
		}
	).replace(/[a-z]+(?=\<\/th\>)/g,
		//replacing english grammar terms with local
		(match)=>chrome.i18n.getMessage(match) + "</th>"
	).replace(new RegExp(form+"<",'g'), `<b>${form}</b><`);
		//make bold that form
}	

function WordStudy(word) {
	//var qs=[];	

	//Array.prototype.slice.call(arguments, 0).forEach(function(word) {
	
	//Does it have greek letters?
	if (word.match(/[\u0390-\u1fff]/) == null) {
		//english word
		return;
	}
	
	//Здесь проверять по-разному: в формах, в значениях...
	var lemmas=forms.filter(form => form.form==(word))
	
	//if (!lemmas.count) lemmas=forms.filter(form => String(form.form).startsWith(word.substr(0, word.length*3/4))) //по начальным буквам смотреть
	
	//if (!lemmas.count) lemmas=forms.filter(form => String(form.form).startsWith(word.substr(0, word.length*3/4))) //по начальным буквам смотреть
	lemmas = lemmas.map(a => a.lemma);
	lemmas = [...new Set(lemmas)]
	
	lemmas.forEach(function(lemma) {
		const url=chrome.runtime.getURL(`pages/wordstudy.html?lemma=${lemma}&form=${word}`);	
		chrome.tabs.create({url: url})			
	})
	
	/* send message to a newly created tab 
	chrome.tabs.create(
		{ url: chrome.runtime.getURL("post.html") },
		function(tab) {
		  var handler = function(tabId, changeInfo) {
			if(tabId === tab.id && changeInfo.status === "complete"){
			  chrome.tabs.onUpdated.removeListener(handler);
			  chrome.tabs.sendMessage(tabId, {url: url, data: data});
			}
		  }
	
		  // in case we're faster than page load (usually):
		  chrome.tabs.onUpdated.addListener(handler);
	
	*/

}


const orderBy={
	"indeclinables": "",
	"verbs": "order by tense, mood, voice, person, number",
	"participles": "order by tense, voice, number, gender, case",
	"nouns": "order by number, gender, case",
	"adjectives": "order by number, gender, case",
	"pronouns": "order by person, number, gender, case"
};



var st;


/*
//functions to view forms table
function json2table(data, form)
{
	//inner borders deliniate
	
  var t=CreateHTMLElement("table");
  
  var tr=CreateHTMLElement("tr", CreateHTMLElement("th", "colspan", data.rowHeaders[0].length,  "rowspan", data.columnHeaders[0].length));
  var trs= new Array(data.columnHeaders[0].length);
  trs[0]=tr
  for (var i=1;i<trs.length;i++) trs[i]=CreateHTMLElement("tr");

	data.columnHeaders.forEach(function(h) {
    if(typeof(h)=="object")
      h.forEach(function(h, i){
        if (trs[i].children.length) { 
          var previousTH=trs[i].lastChild
          if(h==previousTH.innerHTML){
           // alert(previousTH.attributes.colspan.value)
            previousTH.attributes.colspan.value=parseInt(previousTH.attributes.colspan.value)+1;
           // alert('now',previousTH.attributes.colspan.value)
          }else{
            var th=CreateHTMLElement("th",  "colspan", 1, russian(h))
            trs[i].appendChild(th);  
          }
         
        }else
          trs[i].appendChild(CreateHTMLElement("th", "colspan", 1, russian(h))); 
        
      })
    else{
      var th=CreateHTMLElement("th",  "colspan", 1, russian(h))
      trs[0].appendChild(th);
      
    }
  
  });
  
  trs.forEach(function(tr) {t.appendChild(tr);})
	var rowHeadersAbove=[];
	for(i=0; i<data.length; i++)
	{
		row=data[i];
		tr=CreateHTMLElement("tr");
		
		data.rowHeaders[i].forEach(function(rowHeader, j) {
			if (typeof rowHeadersAbove[j]=="object" && russian(rowHeader)==rowHeadersAbove[j].innerText) {
				rowHeadersAbove[j].attributes.rowspan.value=parseInt(rowHeadersAbove[j].attributes.rowspan.value)+1;
			} else {
				var th=CreateHTMLElement("th", "rowspan", 1, russian(rowHeader));
				if (j==0){ tr.style.borderTopWidth="medium";}
				
				tr.appendChild(th);
				rowHeadersAbove[j]=th;
				if (j< data.rowHeaders[0].length) rowHeadersAbove[j+1]=0;
			}
		});
		
		for(j=0; j<row.length; j++)
		{
			cell=row[j];
		
			var value="";
			if (cell!=null) {
				cell.forEach(function(elem) {
					value= value + " " + elem.form;
					//form may be put bold
				});
			}
		
			td=CreateHTMLElement("td", value);
			tr.appendChild(td);
		}
		t.appendChild(tr);
	}
	return t;
}
*/


function EnglishWordView( word)
{
	src="https://www.etymonline.com/word/" & word;
	
	//load the page with xmlhttp

}

function WordInDb(word)
{
	var rs=SqlQuery("select count(1) from lexicon where strcomp(form, '" + word + "')=0")
	return (rs.getstring()>0)
}






/* Возможность искать слово в источниках (не реализована).
Lookup word in texts functionality (not implemented) */

function OnClickLookup()
{
	alert('эта возможность еще не реализована.\r\nThis function is not yet implemented.');
	return;
	
	txtWordsOrSql.value.match(/[\u0300-\u03ff\u1f00-\u1fffa\w]+/g).forEach(function(word) {
		LookupInFiles(dir, word, function(result) {
			echo(result);
		});
	});
}

function LookupInFiles(dir, word, callback)
{
	what=word;
	
}

// обновление лексикона, устранение ошибок. lexicon update, error correction.
function UpdateLexicon(){
	xml.load("d:\\greek\\LiddellScott.xml");
	//remove '-' in the words to facilitate search
}

//===========================================================================
//Просмотр неизвестнаго слова. Поиск подобных, попытка снять приставку и т.п.
//===========================================================================
function UnknownWordView(word)
{

/*
originalWord = word
word = correctaccents(word)

latinWord = greektolatin(word)

divWordId = "word_" + greektolatin(word)
if (IsObject(document.getElementById(divWordId))) {
	alert "Это слово (" + word + ") уже отображается, надо переключиться на него."
	return;
}
divWord = CreateHTMLElement("div", "id", divWordId, "word", word)

//=== Linguistic step 1: Снимем приставки и суффиксы, если есть.
For Each prefix In prefixes
if (regextest(word, "^" + prefix)) {
	unprefixed = Mid(word, Len(prefix) + 1)

	unprefixed = Normalize(unprefixed)

	q = "select * from lexicon where strcomp(form, '" + unprefixed + "')=0"
	SqlAsync q,
	function() {


		GetAccessToHtml divWord

		if (rs.bof) {
			//if(the word is ! detected through prefix,){ look by similar endings.
			GetSimilarForms word, divWord
			return;
		}

		prefix = Left(word, Len(word) - Len(unprefixed))

		rs.MoveFirst
		While Not(rs.eof)

		lemma = rs.Fields("lemma")
		form = rs.Fields("form")
		pos = Trim(rs.fields("pos"))

		if (form == unprefixed) { //because sql sometimes confuses Greek letters.

			//Check the lemma consisting of prefix && the found form, like δη + ἢλεγξα.
			lemma = Normalize(prefix + lemma)

			q = "select count(1) from lexicon where lemma like '" + lemma + "'"
			SqlAsync q, "LemmaCheck_Async", divWord.id, lemma, " like '" + form + "'", pos

			foundUnprefixed = true

		}

		//if(rs.eof){ Exit do    
		rs.movenext
		Wend

		if (foundUnprefixed == false) {
			//if(the word is ! detected through prefix,){ look by similar endings.
			GetSimilarForms word, divWord
			return;
		}

	}


	hasPrefix = true
	Exit For

}
Next

//=== Linguistic step 2: Similar-ending forms.
//if(hasPrefix==False){
GetSimilarForms word, divWord
//}

listLemmas = CreateHTMLElement("select", "class", "listLemmas")

listAnalyses = CreateHTMLElement("select", "style", "display:none;", "class", "listAnalyses")

btnAddForm = CreateHTMLElement("input", "class", "btnAddForm", "type", "button", "value", "Добавить формы", "style", "display:none;", "onclick", "OnClickAddForm(" + divWord.id + ")")

tblForms = CreateHTMLElement("table", "class", "tblForms")

//btnDelete = CreateHTMLElement("input", "type", "button", "value", "Удалить",  //      "onclick", "OnClickRemove('" + word + "')")

With divWord
	.appendChild listLemmas
	.appendChild listAnalyses
	.appendChild btnAddForm
	.appendChild tblForms
End with

mainTabs.addtab word, divWord
*/

}


/*

//=== Linguistic step 2: Similar forms lookup. Huge.
Function GetSimilarForms(word, divWord)

lenEnding = Round(Len(word) / 3)
if (lenEnding < 4) {
	lenEnding = 4

	ending = Right(word, lenEnding)

	q = "select distinct * from lexicon where form like '%" + ending + "'"

	SqlAsync q, "SimilarForms_Async", divWord.id, word, ending

}

//
// Receives the results of the query that finds similar forms.
//
Function SimilarForms_Async(rs, divWord, word, ending)
//todo: do something if(! found. error here if(! found.

GetAccessToHTML divWord

if (rs.bof) {
	divWord.appendChild document.CreateTextNode("No similar forms found")
	return;
}

//Here, since the recordset may contain large number of forms, we will first see
//if(it has forms that have the longest similar endings.

lenEnding = 4
ending = right(word, lenEnding)

rs.movefirst
found = False
While Not(rs.eof)

On Error Resume Next
form = rs.Fields("form")
if (Err) {
	On Error Goto 0
	rs.movefirst
	divword.appendchild p("SimilarForms_Async: no form field in rs. Going to output rs.")
	divword.appendchild p(rs.getstring())
}
On Error Goto 0

if (regextest(form, ending + "$")) {
	//We've found a suitable similar form.
	lemma = rs.Fields("lemma")
	pos = Trim(rs.Fields("pos"))

	//Пытаемся восстановить лимму путем сношения слова и найденной формы.
	GuessLemma word, lemma, form, pos

	found = True
}
rs.movenext
Wend

//next

For Each lg In lemmaGuesses.Items
//see if(we have that lemma.

//it's here that optimization is possible.
//ending should be the longest match of word with the form from which
//lemma was guessed!
For i = 1 To Len(word)
//   echo "regextest(",lg("lemma"), """^"" + Left(", word, i, "), "")",  //     regextest(lg("lemma"), "^" + Left(word, i) )
if (regextest(lg("lemma"), "^" + Left(word, i))) {
	ending = Mid(word, i)
	//    echo "ending", ending
}
Next

//  здесь интересующая нас восстановленная лимма с приставкой может скрываться и в формах

//нельзя ли одним запросом?

//check if(we have it in meanings || lexicon
q = "select lemma from lexicon where strcomp(lemma, '" + lg("lemma") + "')=0 " + "union " + "select lemma from meanings where strcomp(lemma, '" + lg("lemma") + "')=0 " + "union " + "select form from lexicon where strcomp(form, '" + lg("lemma") + "')=0"

SqlAsync q, "LemmaCheck_Async", divWord.id, lg("lemma"), lg("pos"), ending
}


'========================================================
'Подбор лиммы, вещь очень важная.
'========================================================
'Function GuessLemma(byval word, lemma, form, pos)

	'lemma guess method 1.
'	For i = 2 To Len(lemma)
'		If i>Len(form) Then Exit for
'		If GreekCompare(Mid(lemma, i,1), Mid(form, i,1))<>0 Then
'			Exit For
'		End if
'	Next
'	lemmaEnding=Mid(lemma, i)
'	formEnding=Mid(form, i)
'	lemmaBeginning=Left(lemma,1)
'	formBeginning=Left(form,1)
	
'	unprefixed=word
'	For Each prefix In prefixes
'		If strbegin(word, prefix) Then
'			wordPrefix=prefix
'			unprefixed=Mid(word, Len(prefix)+1)
'			Exit for
'		End if
'	Next
'	prefix=wordPrefix
	
''	echo word, lemma, form
	
'	If strend(word, formEnding) Then
		
'		If GreekCompare(Left(unprefixed,1), formBeginning)=0 then		
'			lemmaGuess = Normalize(prefix & lemmaBeginning & _
'								Mid(unprefixed, 2, Len(unprefixed)-Len(formEnding)-1) & lemmaEnding)
			
'			AddLemmaGuess lemmaGuess, form, pos					
			
'			If (pos="verb" Or pos="part") And strend(lemmaGuess, "ω") Then

'				lemmaGuessMid = Left(lemmaGuess, Len(lemmaGuess)-1) & "ομαι"
'				AddLemmaGuess lemmaGuessMid, form, pos	
			
'			ElseIf (pos="verb" Or pos="part") And strend(lemmaGuess, "ομαι") Then
			
'				lemmaGuessAct=Left(lemmaGuess, Len(lemmaGuess)-4) & "ω"
'				AddLemmaGuess lemmaGuessAct, form, pos
				
'			End if	
				
'		End If
	
'		lemmaGuess = left(word, Len(word)-Len(formEnding)) & lemmaEnding									
'		AddLemmaGuess lemmaGuess, form, pos
		
'		If (pos="verb" Or pos="part") And strend(lemmaGuess, "ω") Then

'			lemmaGuessMid = Left(lemmaGuess, Len(lemmaGuess)-1) & "ομαι"
'			AddLemmaGuess lemmaGuessMid, form, pos	
		
'		ElseIf (pos="verb" Or pos="part") And strend(lemmaGuess, "ομαι") Then
			
'			lemmaGuessAct=Left(lemmaGuess, Len(lemmaGuess)-4) & "ω"
'			AddLemmaGuess lemmaGuessAct, form, pos
				
'		End if		
	
				
'	End If
	
	'

'End Function

'Function AddLemmaGuess(lemma, form, pos)
'	Set lemmaGuess=newdict
'	lemmaGuess("lemma")=lemma
'	lemmaGuess("form")=form
'	lemmaGuess("pos")=pos
	
'	Set lemmaGuesses(lemma)=lemmaGuess
	
'End Function




// Called by SimilarForms_Async. SQL query checks whether lemma is in db.
Function LemmaCheck_Async(rs, divWord, lemma, pos, ending)

GetAccessToHtml divWord

if (rs.bof) {
	return;
	rs.movefirst

	While Not(rs.eof)

	divMeaning = CreateHTMLElement("div", "class", "divMeaning", GetMeaning(lemma))
	// divMeaning.id="divMeaning_" + latinWord
	AllowClickingWords divMeaning
	divWord.appendChild divMeaning

	listLemmas.add CreateHTMLElement("option", "value", lemma, lemma)

	rs.movenext
	Wend


}

msg = "Checking lemma " + lg("lemma") + " guessed from form " + lg("form") + ", ending: " + ending
// divWord.appendChild CreateHTMLElement("p", msg)

Next

//prepare analysis data for that form
q = "select distinct * from " + postable(pos) + " where form like '%" + ending + "'"
SqlAsync q, Function PrepareFormsForAnalysis_Async(rs) {

	GetAccessToHTML divWord

	if (rs.bof) {
		alert "PrepareFormsForAnalysis_Async received empty rs.": return;

		rs.MoveFirst
		//divWord.appendchild rsdisplay(rs)

		While Not(rs.EOF)

		//lemma=rs.Fields("lemma")
		//form=rs.Fields("form")

		PrepareAnalysesList listAnalyses, rs.fields

		rs.movenext
		Wend

		listAnalyses.style.display = "inline"
		listAnalyses.size = listAnalyses.children.length
		btnAddform.style.display = "inline"

		//tblForms.innerhtml=RSDisplay(rs).innerHtml

	}

	lemmaGuesses = newdict

}


'
'called from PrepareFormsForAnalysis_Async 
'
'Function PrepareAnalysesList(listAnalyses, fields)

'	spec=""		'Form specification, like aorist indicative 1st sing.
'	specRus=""
'	For Each field In fields
'		If field.Name<>"lemma" And field.Name<>"form" Then
'			spec = Trim(spec & " " & Trim(field.Value))
'			specRus = Trim(specRus & " " & russian(Trim(field.Value)))
'		End if
'	Next
	
'	If InStr(listAnalyses.innerHtml, spec) Then
		'form specification already added. Increase count.

'		For Each opt In listAnalyses.options
'			If InStr(opt.value, spec) Then
				
'				count=(regexsubmatch(opt.textContent, "\((\d+)\)"))
'				opt.textContent=specRus & " (" & Cstr(count+1) & ")"
			
'			End if
'		Next
		
'	Else
		'New form specification, not added yet.
		
'		Set opt=createHtmlElement("option", "value", spec)
'		opt.textcontent=specRus & " (1)"
		
'		listAnalyses.add opt		
'	End If
'End Function

*/


/*

'===========================================================================
'Просмотр неизвестнаго слова. Поиск подобных, попытка снять приставку и т.п.
'===========================================================================
'Function UnknownWordView(word)
'	originalWord=word
'	word=correctaccents(word)
	
'	latinWord=greektolatin(word)
	
'	divWordId="word_" & greektolatin(word)
'	If IsObject(document.getElementById(divWordId)) then
'		alert "Это слово (" & word & ") уже отображается, надо переключиться на него."
'		return;
'	End If
'	Set divWord = CreateHTMLElement("div", "id", divWordId, "word", word)
	
	'=== Linguistic step 1: Снимем приставки и суффиксы, если есть.
'	For Each prefix In prefixes
'		If regextest(word, "^" & prefix) Then
'			unprefixed=Mid(word, Len(prefix)+1)
			
'			unprefixed = Normalize(unprefixed)
			
'			q="select * from lexicon where strcomp(form, '" & unprefixed & "')=0"
'			SqlAsync q, "Prefixes_Async", divWord.id, word, unprefixed
				
				
				'====Linguistic step 1: strip prefix and see if it helps.
'				Function Prefixes_Async(rs, divWord, word, unprefixed)
					
'					GetAccessToHtml divWord
					
'					If rs.bof Then
						'if the word is not detected through prefix, then look by similar endings.
'						GetSimilarForms word, divWord
'						return;
'					End If
						
'					prefix=Left(word, Len(word)-Len(unprefixed))
					
'					rs.MoveFirst
'					While Not(rs.eof)
						
'						lemma=rs.Fields("lemma")
'						form=rs.Fields("form")
'						pos=Trim(rs.fields("pos"))
						
'						If form=unprefixed Then		'because sql sometimes confuses Greek letters.
									
							'Check the lemma consisting of prefix and the found form, like δη + ἢλεγξα.
'							lemma=Normalize(prefix & lemma)
							
'							q="select count(1) from lexicon where lemma like '" & lemma & "'"
'							SqlAsync q, "LemmaCheck_Async", divWord.id, lemma, " like '" & form & "'", pos
							
'							foundUnprefixed=true
					
'						End If
						
						'If rs.eof Then Exit do				
'						rs.movenext
'					Wend
					
'					If foundUnprefixed=false Then
						'if the word is not detected through prefix, then look by similar endings.
'						GetSimilarForms word, divWord
'						return;
'					End If
					
'				End Function

			
'			hasPrefix=true
'			Exit For
					
'		End if
'	Next 
		
	'=== Linguistic step 2: Similar-ending forms.
	'If hasPrefix=False Then
'		GetSimilarForms word, divWord
	'End if
	
'	Set listLemmas = CreateHTMLElement("select", "class", "listLemmas")

'	Set listAnalyses = CreateHTMLElement("select", "style", "display:none;", "class", "listAnalyses")
		 	
'	Set btnAddForm = CreateHTMLElement("input", "class", "btnAddForm", "type", "button", _
'					"value", "Добавить формы", "style", "display:none;", _
'					"onclick", "OnClickAddForm(" & divWord.id & ")")
					
'	Set tblForms = CreateHTMLElement("table", "class", "tblForms")
	
	'	Set btnDelete = CreateHTMLElement("input", "type", "button", "value", "Удалить", _
	'						"onclick", "OnClickRemove('" & word & "')")
	
'	With divWord
'		.appendChild listLemmas
'		.appendChild listAnalyses
'		.appendChild btnAddForm
'		.appendChild tblForms			
'	End with	
	
'	mainTabs.addtab word, divWord
'End Function


'
' Receives the results of the query that finds similar forms.
'
'Function SimilarForms_Async(rs, divWord, word, ending)
	'todo: do something if not found. error here if not found.
	
'	GetAccessToHTML divWord
	
'	If rs.bof Then
'		divWord.appendChild document.CreateTextNode("No similar forms found")
'		return;
'	End If
		
	'Here, since the recordset may contain large number of forms, we will first see
	'if it has forms that have the longest similar endings.

'	lenEnding=4
'	ending=right(word, lenEnding)
				
'	rs.movefirst
'	found=False
'	While Not(rs.eof)
	
'		On Error Resume Next
'		form=rs.Fields("form")
'		If Err Then
'			On Error Goto 0
'			rs.movefirst
'			divword.appendchild p("SimilarForms_Async: no form field in rs. Going to output rs.")
'			divword.appendchild p(rs.getstring())
'		End If
'		On Error Goto 0
	
'		If regextest(form, ending & "$") Then
			'We've found a suitable similar form.
'			lemma=rs.Fields("lemma")
'			pos=Trim(rs.Fields("pos"))
			
			'Пытаемся восстановить лимму путем сношения слова и найденной формы.
'			GuessLemma word, lemma, form, pos
			
'			found=True
'		End If
'		rs.movenext	
'	Wend
	
	'next
	
'	For Each lg In lemmaGuesses.Items
		'see if we have that lemma.
		
		'it's here that optimization is possible.
		'ending should be the longest match of word with the form from which
		'lemma was guessed!
'		For i=1 To Len(word)
'			echo "regextest(",lg("lemma"), """^"" & Left(", word, i, "), "")", _
'					regextest(lg("lemma"), "^" & Left(word, i) )
'			If regextest(lg("lemma"), "^" & Left(word, i) ) Then
'				ending=Mid(word,i)
'				echo "ending", ending
'			End If
'		Next	
		
'		здесь интересующая нас восстановленная лимма с приставкой может скрываться и в формах

		'нельзя ли одним запросом?
		
		'check if we have it in meanings or lexicon
'		q="select lemma from lexicon where strcomp(lemma, '" & lg("lemma") & "')=0 " & _
'			"union " & _
'			"select lemma from meanings where strcomp(lemma, '" & lg("lemma") & "')=0 " & _
'			"union " & _
'			"select form from lexicon where strcomp(form, '" & lg("lemma") & "')=0"
			
'		SqlAsync q, "LemmaCheck_Async", divWord.id, lg("lemma"), lg("pos"), ending
		
'		msg= "Checking lemma " & lg("lemma") & " guessed from form " & lg("form") & ", ending: " & ending
	'	divWord.appendChild CreateHTMLElement("p", msg)
			
'	Next
	
	'prepare analysis data for that form
'	q="select distinct * from " & postable(pos) & " where form like '%" & ending & "'"
'	SqlAsync q, "PrepareFormsForAnalysis_Async", divWord.id
	
'	Set lemmaGuesses=newdict
					
'End Function


'=== Linguistic step 2: Similar forms lookup. Huge.
'Function GetSimilarForms(word, divWord)

'	lenEnding= Round(Len(word)/3)
'	If lenEnding<4 Then lenEnding=4
	
'	ending=Right(word, lenEnding)

'	q="select distinct * from lexicon where form like '%" & ending & "'"
	
'	SqlAsync q, "SimilarForms_Async", divWord.id, word, ending
	
'End function


'
'
'
'Const dbg=true
'Set lemmaGuesses=newdict


' Called by SimilarForms_Async. SQL query checks whether lemma is in db.
'Function LemmaCheck_Async(rs, divWord, lemma, pos, ending)
		
'	GetAccessToHtml divWord
	
'	If rs.bof Then return;
'	rs.movefirst
	
'	While Not(rs.eof)
					
'		Set divMeaning=CreateHTMLElement("div", "class", "divMeaning", GetMeaning(lemma))
		'	divMeaning.id="divMeaning_" & latinWord
'		AllowClickingWords divMeaning
'		divWord.appendChild divMeaning
		
'		listLemmas.add CreateHTMLElement("option", "value", lemma, lemma)
			
'		rs.movenext
'	Wend
	
	
'End Function


'called from: LemmaCheck_Async.
'Function PrepareFormsForAnalysis_Async(rs, divWord)
	
'	GetAccessToHTML divWord
	
'	If rs.bof Then alert "PrepareFormsForAnalysis_Async received empty rs.": return;
		
'	rs.MoveFirst
	'divWord.appendchild rsdisplay(rs)
	
'	While Not(rs.EOF)
		
		'lemma=rs.Fields("lemma")
		'form=rs.Fields("form")
	
'		PrepareAnalysesList listAnalyses, rs.fields
							
'		rs.movenext
'	Wend

'	listAnalyses.style.display="inline"
'	listAnalyses.size=listAnalyses.children.length
'	btnAddform.style.display="inline"
	
	'tblForms.innerhtml=RSDisplay(rs).innerHtml
	
'End Function


'Function LookupWord(word)
'	lookup=word
'	lookup=regexreplace(lookup, vowels)
	
'	q="select * from lexicon where form like '" & lookup & "' or lemma like '" & lookup & "'"
'	SqlAsync q, "LookupWord_Results"
	
'	q="select * from meanings where lemma like '" & lookup & "') or meaning like '%" & lookup & "' " & _
'		 "or meaning like '" & lookup & "'" 
'	SqlAsync q, "LookupWord_Results"

'End Function


'there is a problem in db with mediapassive forms...
'Function SortOutMediaPassive()
'	form="aor imperat mp"
	
	
'	tense=Split(form)(0)
'	mood=Split(form)(1)
'	voice=Split(form)(2)
	
'	Select Case voice
'		Case "mp"
'			otherVoice1="mid"
'			otherVoice2="pass"
'		Case "mid"
'		Case "pass"
'	End Select

'	delete1=format("delete from verbs where tense='", tense, "' and mood='", mood, "' and voice='", _
'					voice, "' and form in ( select form from verbs where tense='", _
'					tense, "' and mood='", mood, "' and voice='", otherVoice1, "' )")

'	delete2=format("delete from verbs where tense='", tense, "' and mood='", mood, "' and voice='", _
'					voice, "' and form in ( select form from verbs where tense='", _
'					tense, "' and mood='", mood, "' and voice='", otherVoice2, "' )")

	
'	echo delete1
'	echo delete2
'End function



'Function CorrectAccentlessPieces()
'	regex.Pattern="[ >.,·;·]([α-ω]+)[ <.,·;·]"
	
'	Set pieces=newdict
'	For Each match In regex.Execute(greektext)
'		pieces(match.submatches(0))=1
'		If confirm(match.value) Then
'			greekText=regex.Replace(greekText, endQuoteReplace)
'		End If
'	Next
	
'	For Each piece In pieces
	
		'echo piece

'		Set button = document.createElement("input")
'		button.value=piece & "-"
'		button.type="button"
'		button.attributes.OnClick.value="OnClickCorrect('" & piece & " ');"
		
'		regex.Pattern="[ >.,·;·]" & Trim(piece) & "( [\u0370-\u03ff\u1f00-\u1fff]+)."
		
'		For Each match In regex.Execute(greekText)
'			matches = matches & " " & match.value
'		Next
	
	'	If Len(matches)<100 Then
'			document.body.appendChild button
'			echo matches
	'	End if
	
'		matches=""
		
'		Set button = document.createElement("input")
'		button.value="-" & piece
'		button.type="button"
'		button.attributes.OnClick.value="OnClickCorrect(' " & piece & "');"
	
'		regex.Pattern=".([\u0370-\u03ff\u1f00-\u1fff]+ )" & Trim(piece) & "[ <.,·;·]"
'		For Each match In regex.Execute(greekText)
'			matches = matches & " " & match.value
'		Next
	
		'If Len(matches)<100 Then
'		document.body.appendChild button
'		echo matches
	
'		matches=""
		
'		c=c+1
'		If c=100 Then Exit for
'	Next
'End Function

*/
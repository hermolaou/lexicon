/*
Glory to God for everything.

*/

function QueryPerseus (word, callback) {

	/*
	'todo:eventually make it so it leaves only Greek letters.
	'	For Each wasteChar In Split("[ ] ^ * # : . ;")
	'		If InStr(word, wasteChar) Then word=Replace(word, wasteChar, "")
	'	Next
	*/

	url = xmlMorphUrl(word);
	
	//'hey, make sure we have Internet connection.
	if (typeof callback == 'undefined') callback=function() {};
	
	if (url.length==0) {
		callback(word, false);
		return;
	}
	

	httpgetasync (url, function() {
		if (xmlhttp.readyState != READYSTATE_COMPLETE) return;
		XMLMorphResponseReceiver (word, callback);		
	});
};

/*
'===============================================================================
'Functions to query forms from Perseus.
'===============================================================================


Const xmlMorphUrlStart = "http://www.perseus.tufts.edu/hopper/xmlmorph?lang=greek&lookup="

'==================
'Просмотр слова.
'==================

Function PerseusWordViewCallback(word, success)
'	alert format("Pers. WV callback", success)
	If success Then
'		alert "VW " & word
		WordView word
	Else
		UnknownWordView word
	End If
End Function





'=
' It 
' should be prepared to handle constraints. mid/mp/pass should not be mixed. 
'=
Function XMLMorphResponseReceiver(word, callback)

	Set xmlmorph = xmlhttp.responseXML
	Set morphs = xmlmorph.getElementsByTagName("analysis")
	Set data= newdict

	If morphs.length=0 Then
		'move to unknownwords.
		SqlInsert "unrecognized", word
		success=False
	End If
	
	alert  xmlmorph.xml
		
	On Error Resume Next
	SqlDelete "unparsed", "lemma", word
	On Error Goto 0
	
	'if it has different lemmas, load them all.
	For Each analysis In morphs
			
		For Each datum In analysis.childNodes
			data(datum.nodeName) = datum.text
		Next
		
		If Not(posTable.exists(data("pos"))) Then
			alert "Unknown position:" & data("pos")
		End If
		
		'SqlDelete "greek", "word", data("form")
		SqlDelete "unparsed", "lemma", data("form")		
		
		SqlInsert "lexicon", data
		SqlInsert posTable(data("pos")), data
		
		If data.exists("expandedForm") And data("expandedForm")<>data("form") Then
			data("form")=data("expandedForm")
			
			SqlInsert "lexicon", data
			SqlInsert posTable(data("pos")), data
			
			SqlDelete "unparsed", "lemma", data("form")		
		End If
		
		If Not(WordInDB(data("lemma"))) Then
			echo "quering lemma", data("lemma")
			QueryPerseus data("lemma")
		End If
						
	Next
	
	'set success if insertion successful and if the word matches exact.
	Call callback (word, success)
		
End Function

Function ReadNextWord()
	
	If finish Then
		FreeDB
		Exit Function
	End if
	
	On Error Resume next
	Do
		word=rs.Fields(0)
		If Err Then
			rs.MoveNext
			Err.Clear
		Else
			Exit do
		End If
		If rs.EOF Then
			'done.
			For Each table In tableRS
				tableRS(table).close
			Next
			
			rs.Close
			Exit Function
		End if
		
	Loop
	On Error Goto 0
	'wordp.innerText= word
	
	QueryPerseus word, GetRef("Callback1")

End Function

Function Callback1(word, success)
	'but can't we do moving next in ReadNextWord?
	rs.MoveNext
	ReadNextWord
End Function


Function CheckDownload()
	OnClickButtonStatus
	count=conn.Execute("select count(*) from unparsed").Fields(0)
	'echo "Previous count", prevCount, "now", count
	If count=prevCount Then ReadNextWord
	prevCount=count
End function

Function xmlMorphUrl(word)
	
	If Len(word)>=1 Then

		link = GreekToLatin(word)
		If link <> "" Then
			link = xmlMorphUrlStart & link
			xmlMorphUrl = link
		End if
	
	End if
	'WScript.Echo link
End Function
*/
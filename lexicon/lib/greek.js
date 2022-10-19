/*
For the glory of God. 
'
' Δόξα Θεῷ πάντων ἒνεκα.
'
*/


const positionsMap = ["nouns: noun", 
"adjectives: adj", 
"verbs: verb", 
"participles: part", 
"pronouns: pron", 
"indeclinables:exclam adv partic article conj irreg interj prep numeral"]

/*
Set posTable=CreateObject("scripting.dictionary")
For Each map In positionsMap
	table= Trim(RegExSubMatch(map, "(^.+):"))
	'echo table
	For Each pos In Split(Trim(RegExSubMatch(map, ":(.+$)")))
		posTable(Trim(pos)) = table
	next  
Next



prefixes =Array("δι","δυσ")
*/

const grammarCategories={
	tense: "pres imperf fut futperf aor perf plup",
	mood: "ind subj opt imperat inf",
	voice: "act mid mp pass",
	number: "sg pl dl",
	case: "nom gen dat acc voc",
	gender: "masc fem neut"
}

/*
Не нужна больше, когда есть String.normalize()
function ReplaceExtChars(text) {
	
	var patches=
		[
			'ύύ','άά','έέ','ίί','όό','ήή','ώώ'
		];
		
//	lowChars = "[ύάέίόήώ]";	//' Greek regular, with low char codes.
//	extChars = "[ύάέίόήώ]";	//' Greek extended, high char codes
	
	patches.forEach(function(r) {
		text=text.replace(new RegExp(r.charAt(0),"g"), r.charAt(1));
	});
	
	return text;
	
}
*/

// должна заменять тяжелое ударение на острое (гравис на акут)
//и удалять из слова второе ударение, если есть 

// on github check the existing downloaders/uploaders vk archive wikimedia
function GreekNormalize(word){
	
	//можно через normalize - replace - normalize
	word=word.normalize('NFD').replace("̀", "́").normalize();
	/*lowercase
	double streess
	*/
	return word
}

/*
'===========================================
unwantedChars = "[.,·\;\[\]·]|<.+>|（.+）|^\s+|\s+$"
Function CleanWord(word)
	
'	echo "Cleaning word " & word
	
	clean=regexmatch(word, "[A-Za-z\u0390-\u1fff]+")
	'word=regexreplace(word, unwantedChars, "")
    
 '   alert "Clean word" &  word
    CleanWord=clean
End function


'===========================================
vowels = "ή η η ά α α ε ε έ ο ι ι υ υ ω" 
vowelsWB = "ἤ ἠ ἡ ἄ ἀ ἁ ἐ ἑ ἔ ὀ ἰ ἱ ὑ ὐ ὠ"

Function Breathing(byval word)
	For Each vowel In Split(vowels)
		If strbegin(word, vowel) Then
			If (InStr(vowelsWB, Mid(word,2,1))=0) Then
				letter1=Mid(vowelsWB, InStr(vowels, vowel), 1)
				restOfWord=Mid(word, 2)

				word=letter1 & restOfWord
				Exit For
			End if
		End If
	Next
	breathing=word
End Function

Function Normalize(byval word)
	word=CleanWord(word)
	word=Left(word,1) & LCase(Mid(word,2))
		
	word=breathing(word)
	
	For i=3 To Len(word)
		char=Mid(word, i, 1)
		instrchar=InStr(vowelsWB, char)
		If instrchar Then
			char=Mid(vowels, instrchar,1)
			word = Left(word, i-1) & char & Mid(word, i+1)
		End if		
	Next
	
	Normalize=(CorrectAccents(word))
End Function



'Function GreekCompare(l1, l2)
'	If breathing(l1)=breathing(l2) Then
'		GreekCompare=0
'	Else
'		GreekCompare=1
'	End if
'End Function
'==============================================================


Function GreekToLatin(ByVal word)
	dim i
	
	greek = "ύµαἀᾷάἁἂᾶὰβγδΔΔεέἐἑὲἒζηήῄἠἡἣῆὴῃθιἰίἱὶῖκλμνξοόὀὁὸπῥρσςτυύὒὓῦὐὺφχψωώὠὣῶῷὼῳὡὑῇᾳὧὦἌᾀὑῤἵἔἵἔἧὅῄὑἎᾀἶϊὑἄὑἶἶὕὖἅᾳἴἄὑἔὑὑᾳᾳἅἜῇᾷἎᾀἔἥὦἜἔἵῃὑὥἌᾀἢἃἕὔὄὃῒᾗἓἦὤἷᾠὗῴΐὢἬᾄᾔᾖᾆἤἳᾧἪϛὋἝᾅὌᾐᾴᾑὂϋ"
	latin = "umaaaaaaaabgdddeeeeeezhhhhhhhhhqiiiiiiklmncoooooprrsstuuuuuuufxywwwwwwwwwuhawwAaurieiehohuAaiiuauiiuuaaiaueuuaaaEhaAaehwEeihuwAahaeuooihehwiwuwiwHahhahiwHsOEaOhahou"

	word = LCase(word)

	For i = 1 To Len(word)
		char = Mid(word, i, 1)
		
		if char = "∆" then result = result + "D"
			
		If InStr(greek, char) Then
			char = Mid(latin, InStr(greek, char), 1)
			result = result + char
		End if
		
	Next
	GreekToLatin = result

End Function


Function LatinToGreek(byval word)
	word = LCase(word)
	
	If strbegin(word, "*") Or InStr(word, "—") Then
		LatinToGreek=""
		Exit Function
	End If
	word=CleanWord(word)
	
	latin="abcdefghijklmnopqrstuvwxyz"
	greek="αβξδεφγηι κλμνοπθρστυϝωχψζ"
	Dim aux,c
	
	i=1
	For i=1 To Len(word)
		char = Mid(word, i, 1)
		
		If InStr(latin, char) Then
			If Len(aux) Then
				For j=1 To Len(aux)
					Select Case Mid(aux,j,1)
						Case ")"
							c=c & chrw(&H313)	'psili
						Case "("
							c=c & chrw(&H314)	'dasia
						Case "/"
							c=c & chrw(&H0301)	'oxia, tonos
						Case "\"
							c=c & chrw(&H0300)	'varia		
						Case "="
							c=c & chrw(&H342)	'perispomeni
						Case "|"
							c=c & chrw(&H345)	'upogegrammeni (iota subscr.)
						Case "+"
							c=c & chrw(&H308)
						Case "_"
						Case Else
							c=c & Mid(aux,j,1)
					End Select
						
				next
			End If

			char = Mid(greek, Asc(char)-Asc("a")+1, 1)
			result = result &  c & char
			aux=""
			c=""

		Else
			aux=aux & char
		End If
		
	Next
	If Len(aux) Then
		For j=1 To Len(aux)
			Select Case Mid(aux,j,1)
				Case ")"
					c=c & chrw(&H313)	'psili
				Case "("
					c=c & chrw(&H314)	'dasia
				Case "/"
					c=c & chrw(&H0301)	'oxia, tonos
				Case "\"
					c=c & chrw(&H0300)	'varia		
				Case "="
					c=c & chrw(&H342)	'perispomeni
				Case "|"
					c=c & chrw(&H345)	'upogegrammeni (iota subscr.)
				Case "+"
					c=c & chrw(&H308)
				Case "'"
					c=c & "᾽"
				Case "_"
				Case Else
					c=c & Mid(aux,j,1)
			End Select
		next
		result = result + c
	End If
	
	If Right(result,1)="σ" Then result = Left(result, Len(result)-1) & "ς"
	result=Replace(result, "σ ", "ς ")
	result=Replace(result, "σ,", "ς,")
	result=Replace(result, "σ.", "ς.")
	result=Replace(result, "σ" & vblf, "ς" & vblf)
	
	latintogreek = (result)
End Function




'Function ReplaceExtChars(text)

'	lowChars = "[ύάέίόήώ]"	' Greek regular, with low char codes.
'	extChars = "[ύάέίόήώ]"	' Greek extended, high char codes
'	regex.pattern=extChars 
'	For Each match In regex.Execute(text)
'		greekChar= Mid(lowChars, InStr(extChars, match.value), 1)
'		text = Replace(text, match.value, greekChar)
'	Next
	
'	ReplaceExtChars=text
'End Function

Function CheckDiacritics(text)
	regEx.Pattern="[\u0300-\u036F]"
	CheckDiacritics = regex.Test(text)
End function

*/

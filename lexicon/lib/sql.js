/*
Doxa soi, Kyrie, doxa soi.
*/

var queries = [];	//queue

function SqlAsync(q, OnCompletion)
{
	//add to queue
	if (typeof conn=="undefined")
		SqlConnect (dbFile)
	
	if (typeof q == "string")
		queries.push({q:ReplaceExtChars(q), callback:OnCompletion});
	else if (typeof q=="object")
		q.forEach(function(query) {
			queries.push({q:ReplaceExtChars(query), callback:OnCompletion});
		});
	
	if (conn.State==(adStateOpen | adStateExecuting))
		return; //Query in progress.
		
	//if queue not empty then run the next query
	if (queries.length==0) return;

	//get from queue
	q=queries.shift();
	
	var rs=conn.Execute (q.q, null, adAsyncExecute);
		
	var sqlInterval=self.setInterval (function () {
		if (rs.state==adStateExecuting) return;
		
		self.clearInterval (sqlInterval);
		
		if (conn.Errors.Count) {
			echo ("adodb errors count:", conn.Errors.Count);
			
			alert (format("ADODB error:", conn.Errors(0).Description, "\n", "Query: ", q.q));					
		
		} else {
						
			//may the recordset be closed at this point?
			if (rs.State==adStateClosed)
				alert ("Recordset arrived closed. This is strange.\n" + q.q);
			else
				q.callback(rs, q.q);
			
			rs.Close();
			
		}	
		
		SqlAsync();
	
	}, 50);

}

function RSDisplay(rs){
	/*
	dim field
	
	Set rstable = CreateHtmlElement("table")
	
	Set tr = document.createElement("tr")
	rstable.appendChild tr
	For Each field In rs.Fields
		Set th = document.createElement("th")
		th.innerText=field.Name
		tr.appendChild th
	Next
	
	If rs.BOF Then
		Set RSDisplay=rstable
		Exit function
	End if
	
	rs.MoveFirst
	While Not(rs.EOF)
		Set tr = document.createElement("tr")
		tr.setAttribute "bookmark", rs.bookmark
		For Each field In rs.Fields
			Set td = document.createElement("td")
			td.className=field.Name
			If IsNull (field.Value)=False Then
				td.innerText=field.Value
			End if
			tr.appendChild td
		Next
		rstable.appendChild tr

		rs.MoveNext
	Wend
	*/
	return rstable
}

/*
'Initialize.
Dim connStr
dim adox
dim conn

Function SqlConnect(dbFile)

'	Set adox = CreateObject("adox.catalog")
	Set conn = CreateObject("ADODB.connection")
	'Set rs = CreateObject("adodb.recordset")
	
	'mdacx86ConnStr="Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" & dbFile
	connStr="Driver={Microsoft Access Driver (*.mdb, *.accdb)}; DBQ=" & dbFile & ";"	
		
	conn.CursorLocation=adUseClient
	
	On Error Resume Next
	conn.Open connStr
	If err Then
		On Error GoTo 0
		alert "Can't work with the DB. Is Microsoft database driver installed?"
	End if
	On Error GoTo 0

'	adox.ActiveConnection= connStr
	
End Function

'===================================================
'= Functions
'===================================================

Function SqlQuery(q)
	if not(IsObject(conn)) then SqlConnect dbFile
	Set SqlQuery=conn.Execute(q)
End Function




'==================================
'Базовые операции с базой данных.

'on duplicate value it breaks.
Function SqlUpdate(table, column, value, where)
	q="update " & table & " set " & column & _
								"=" & value & " where " & where 
				
	Set SqlUpdate = SqlQuery(q)

End Function


Function SqlDelete(table, column, value)
	'see if asynchr. query in progress!
	if not(IsObject(conn)) then SqlConnect dbFile
	
	q = "delete from " & table & " where " & column & "='" & Replace(value, "'", "''") & "'" 
	Set SqlDelete = conn.Execute (q)
End function

'
Function SqlExists(table, column, value)
	if not(IsObject(conn)) then SqlConnect dbFile
	
	q="select count(1) from " & table &" where `" + column+"`='" + Replace(value, "'", "''") + "'"
	Set qrs=conn.Execute (q)

	count= qrs.Fields.Item(0)
	
	SqlExists = False
	If count>=1 Then SqlExists = True  
End Function


Function FreeDB()

	On Error Resume Next
	Set adox = Nothing
	
	For Each table In tableRS
		tableRS(table).close
	Next

	conn.Close
	
End Function



*/
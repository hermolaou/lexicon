
const lemma=new URLSearchParams(document.location.search).get("lemma") 
const form=new URLSearchParams(document.location.search).get("form")

document.title=lemma + " (" +form + ")"

chrome.runtime.sendMessage({todo:'getLemmaData', lemma: lemma, form: lemma}, (resp)=>{
    hDescription.innerHTML=resp.description
    divMeaning.innerHTML=resp.meaning;

    tblForms1.innerHTML=resp.formsTable

})



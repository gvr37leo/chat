/// <reference path="node_modules/vectorx/vector.ts" />
/// <reference path="node_modules/utilsx/utils.ts" />

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

class Message{
    createdAt:Date = new Date()
    // html:HTMLElement
    // repliesspan:HTMLSpanElement
    // mentions:HTMLElement[]
    constructor(
        public id:number,
        public text:string,
    ){

    }
}
function addMessage(text:string):number{
    var regex = />>([0-9]{1,6})/g
    var result = regex.exec(text)
    var newmessageid = messageidcounter++
    
    while(result != null){
        mentions.push(new Mention(mentionidcounter++, newmessageid, parseInt(result[1])))
        result = regex.exec(text)
    }
    messages.push(new Message(newmessageid,text))
    
    return newmessageid
}

function renderMessage(id:number,previewLinks:boolean):HTMLElement{
    var mentions = findMentions(id)
    var replies = findReplies(id)
    var message = findMessage(id)
    var regex = />>([0-9]{1,6})/g

    var replieselements = replies.map(rep => {
        var element = string2html(`<a style="margin-right:10px;" href="#${rep.id}">${rep.id}</a>`)
        if(previewLinks){
            addPreviewAndConversationLink(element,rep.id)
        }
        return element
    })

    var replaceresult = message.text.replace(regex,(substring,p1) => {
        return `<a href="#${p1}" data-messageid="${p1}">${substring}</a>`
    })

    var html = string2html(`
        <div style="border:1px solid black; margin:10px 0px; padding:10px; max-width:700px; max-height:200px; overflow:auto; background-color: white;">
            <a name="${message.id}" href="#${message.id}">${message.id}</a> replies <span id="replies"></span>
            <pre id="textcontainer" style="font-family:Arial, Helvetica, sans-serif;">${replaceresult}</pre>
        </div>
    `)
    var repliesContainer = html.querySelector('#replies')
    for(let element of replieselements){
        repliesContainer.appendChild(element)
    }
    
    var mentionelements = Array.from(html.querySelectorAll('pre a')) as HTMLElement[]
    for(let mention of mentionelements){
        if(previewLinks){
            addPreviewAndConversationLink(mention,parseInt(mention.dataset.messageid))
        }
    }
    return html
}

function addPreviewAndConversationLink(linkelement:HTMLElement,targetmessageid:number){
    if(findMessage(targetmessageid) == null){
        return
    }else{
        linkelement.addEventListener('mouseenter', e => {
            setCursorFloater2(linkelement, targetmessageid)
        })

        // mention.addEventListener('mouseleave',e => {
        //     cursorfloater.style.display = 'none'
        // })

        linkelement.addEventListener('click', e => {
            e.preventDefault()
            conversationcontainer.appendChild(renderMessage(targetmessageid,true))
            //add to convo
        })
    }
}

class Mention{
    constructor(
        public id:number,
        public originalMessage:number,
        public mentionedMessage:number,
    ){

    }
}

function findMessage(messageid:number){
    return messages.find(m => m.id == messageid)
}

function findReplies(messageid:number){
    return mentions.filter(m => m.mentionedMessage == messageid)
}

function findMentions(messageid:number){
    return mentions.filter(m => m.originalMessage == messageid)
}

var textarea = document.querySelector('#textmessage') as HTMLTextAreaElement
var sendbtn = document.querySelector('#sendbtn') as HTMLElement
var messagecontainer = document.querySelector('#messagecontainer') as HTMLElement
var cursorfloater = document.querySelector('#cursorfloater') as HTMLElement
var conversationcontainer = document.querySelector('#conversationcontainer') as HTMLElement
var messageidcounter = 0
var messages:Message[] = []
var mentionidcounter = 0
var mentions:Mention[] = []


messagecontainer.appendChild(renderMessage(addMessage('test message'),true))

function sendMessage(){
    messagecontainer.appendChild(renderMessage(addMessage(textarea.value),true))
    textarea.value = ''
}

sendbtn.addEventListener('click',e => {
    sendMessage()
})

textarea.addEventListener('keydown', e => {
    if(e.key == 'Enter' && e.shiftKey){
        e.preventDefault()
        sendMessage()
    }
})

document.addEventListener('mousedown', e => {
    var target = e.target as HTMLElement
    if(target.closest('#cursorfloater') != cursorfloater){
        cursorfloater.style.display = 'none'
    }
})

function setCursorFloater2(poselement:HTMLElement,targetMessage:number){
    cursorfloater.style.display = ''
    var rect = poselement.getBoundingClientRect()
    cursorfloater.style.top = `${rect.top + window.pageYOffset + 5}px`
    cursorfloater.style.left = `${rect.right + window.pageXOffset + 5}px`
    cursorfloater.replaceChild(renderMessage(targetMessage,false),cursorfloater.firstChild)
}


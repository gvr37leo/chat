/// <reference path="node_modules/vectorx/vector.ts" />
/// <reference path="node_modules/utilsx/utils.ts" />
/// <reference path="message.ts" />

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
var conversationMessages:number[] = []

textarea.focus()
textarea.value = 'test message'
sendMessage()
textarea.value = '>>0'

sendbtn.addEventListener('click',e => {
    sendMessage()
})

function sendMessage(){
    let newmessageid = addMessage(textarea.value)
    messagecontainer.innerHTML = ''
    for(var message of messages){
        messagecontainer.appendChild(renderMessage(message.id,true,(linktarget) => {
            conversationMessages = [linktarget]
            renderConvo()
        }))
    }
    // messagecontainer.appendChild(renderMessage(newmessageid,true,(linktarget) => {
    //     conversationMessages = [linktarget]
    //     renderConvo()
    // }))
    textarea.value = ''
}


function renderConvo(){

    conversationcontainer.innerHTML = ''
    for (let i = 0; i < conversationMessages.length; i++) {
        let messageid = conversationMessages[i];
        conversationcontainer.appendChild(renderMessage(messageid,true,(linktarget) => {
            conversationMessages.splice(i + 1)
            conversationMessages.push(linktarget)
            renderConvo()
        }))
    }
}



textarea.addEventListener('keydown', e => {
    if(e.key == 'Enter' && e.shiftKey){
        e.preventDefault()
        sendMessage()
    }
})

document.addEventListener('click', e => {
    var target = e.target as HTMLElement
    if(target.closest('#cursorfloater') != cursorfloater){
        cursorfloater.style.display = 'none'
    }
})

function setCursorFloater(poselement:HTMLElement,targetMessage:number){
    cursorfloater.style.display = ''
    var rect = poselement.getBoundingClientRect()
    cursorfloater.style.top = `${rect.top + window.pageYOffset + 5}px`
    cursorfloater.style.left = `${rect.right + window.pageXOffset + 5}px`
    cursorfloater.replaceChild(renderMessage(targetMessage,false,() => {
        console.log('hover message link')
    }),cursorfloater.firstChild)
}


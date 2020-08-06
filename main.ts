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

    render(){
        // var regex = />>([0-9]{1,6})/g
        // var arr:RegExpExecArray[] = []
        // var result = regex.exec(this.text)
        // while(result != null){
        //     arr.push(result)
        //     result = regex.exec(this.text)
        // }
        // for(var item of arr){
        //     var mentionid = parseInt(item[1])
        //     mentions.push(new Mention(mentionidcounter++,this.id,mentionid))
        //     var mentiomessage = findMessage(mentionid)
        //     if(mentiomessage){
        //         mentiomessage.addReply(this.id)
        //     }
        // }

        // var replaceresult = this.text.replace(regex,(substring,p1) => {
        //     return `<a href="#${p1}" data-messageid="${p1}">${substring}</a>`
        // })
        // this.html = string2html(`
        //     <div style="border:1px solid black; margin:10px 0px; padding:10px; max-width:700px; max-height:200px; overflow:auto; background-color: white;">
        //         <a name="${this.id}" href="#${this.id}">${this.id}</a> replies <span id="replies"></span>
        //         <pre style="font-family:Arial, Helvetica, sans-serif;">${replaceresult}</pre>
        //     </div>
        // `)
        // this.repliesspan = this.html.querySelector('#replies')
        // this.mentions = Array.from(this.html.querySelectorAll('pre a'))
        // for(let mention of this.mentions){
        //     this.addPreviewAndConversationLink(mention,parseInt(mention.dataset.messageid))
            
        // }

        // return this.html
    }

    // copy(){
    //     var msg = new Message(this.id,this.text)
    //     msg.createdAt = this.createdAt
    //     return msg
    // }

    // addReply(replyid:number){
    //     var tag = string2html(`<a style="margin-right:10px;" href="#${replyid}">${replyid}</a>`)
    //     this.addPreviewAndConversationLink(tag,replyid)
    //     this.repliesspan.appendChild(tag)
    // }

    addPreviewAndConversationLink(linkelement:HTMLElement,targetmessageid:number){
        var targetmessage = findMessage(targetmessageid)
        if(targetmessage == null){
            return
        }else{
            linkelement.addEventListener('mouseenter', e => {
                setCursorFloater(linkelement, targetmessage.html)
            })

            // mention.addEventListener('mouseleave',e => {
            //     cursorfloater.style.display = 'none'
            // })

            linkelement.addEventListener('click', e => {
                e.preventDefault()
                conversationcontainer.appendChild(targetmessage.copy().render())
                //add to convo
            })

        }
    }
}
function addMessage(text:string):number{
    var regex = />>([0-9]{1,6})/g
    var result = regex.exec(this.text)
    var newmessageid = messageidcounter++
    
    while(result != null){
        mentions.push(new Mention(mentionidcounter++, newmessageid, parseInt(result[1])))
        result = regex.exec(this.text)
    }
    messages.push(new Message(newmessageid,text))
    
    return newmessageid
}

function renderMessage(id:number):HTMLElement{
    var mentions = findMentions(id)
    var replies = findReplies(id)
    var message = findMessage(id)
    var regex = />>([0-9]{1,6})/g
    
    var replaceresult = this.text.replace(regex,(substring,p1) => {
        return `<a href="#${p1}" data-messageid="${p1}">${substring}</a>`
    })
    var html = string2html(`
        <div style="border:1px solid black; margin:10px 0px; padding:10px; max-width:700px; max-height:200px; overflow:auto; background-color: white;">
            <a name="${this.id}" href="#${this.id}">${this.id}</a> replies <span id="replies"></span>
            <pre style="font-family:Arial, Helvetica, sans-serif;">${replaceresult}</pre>
        </div>
    `)
    
    this.mentions = Array.from(this.html.querySelectorAll('pre a'))
    for(let mention of this.mentions){
        this.addPreviewAndConversationLink(mention,parseInt(mention.dataset.messageid))
        
    }
    return html
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

function findMessageChain(){

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

var message = new Message(messageidcounter++,'test message')
messagecontainer.appendChild(message.render())
messages.push(message)

function sendMessage(){
    var message = new Message(messageidcounter++,textarea.value)
    messages.push(message)
    messagecontainer.appendChild(message.render())
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

function setCursorFloater(poselement:HTMLElement,targetElement:HTMLElement){
    cursorfloater.style.display = ''
    var rect = poselement.getBoundingClientRect()
    
    cursorfloater.style.top = `${rect.top + window.pageYOffset + 5}px`
    cursorfloater.style.left = `${rect.right + window.pageXOffset + 5}px`
    cursorfloater.replaceChild(targetElement.cloneNode(true),cursorfloater.firstChild)
}

// function setCursorFloater(poselement:HTMLElement,targetMessage:number){
//     var target = findMessage(targetMessage)
//     cursorfloater.style.display = ''
//     var rect = poselement.getBoundingClientRect()
    
//     cursorfloater.style.top = `${rect.top + window.pageYOffset + 5}px`
//     cursorfloater.style.left = `${rect.right + window.pageXOffset + 5}px`
//     cursorfloater.replaceChild(target.copy().render(),cursorfloater.firstChild)
// }


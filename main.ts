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
    html:HTMLElement
    repliesspan:HTMLSpanElement
    constructor(
        public id:number,
        public text:string,
    ){

    }

    render(){
        var regex = />>([0-9]{1,6})/g
        var arr:RegExpExecArray[] = []
        var result = regex.exec(this.text)
        while(result != null){
            arr.push(result)
            result = regex.exec(this.text)
        }
        for(var item of arr){
            var mentionid = parseInt(item[1])
            mentions.push(new Mention(mentionidcounter++,this.id,mentionid))
            findMessage(mentionid)?.addReply(this.id)
        }

        var replaceresult = this.text.replace(regex,(substring,p1) => {
            return `<a href="#${p1}">${substring}</a>`
        })
        this.html = string2html(`
            <div style="border:1px solid black; margin:10px 0px; padding:10px; max-width:700px; max-height:200px; overflow:auto;">
                <a name="${this.id}" href="#${this.id}">${this.id}</a> replies <span id="replies"></span>
                <pre style="font-family:Arial, Helvetica, sans-serif;">${replaceresult}</pre>
            </div>
        `)
        this.repliesspan = this.html.querySelector('#replies')
        
        return this.html
    }

    addReply(replyid:number){
        this.repliesspan.insertAdjacentHTML('beforeend',`<a href="#${replyid}">${replyid}</a>`)
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

function findMessageChain(){

}


var textarea = document.querySelector('#textmessage') as HTMLTextAreaElement
var sendbtn = document.querySelector('#sendbtn') as HTMLElement
var messagecontainer = document.querySelector('#messagecontainer') as HTMLElement
var messageidcounter = 0
var messages:Message[] = []
var mentionidcounter = 0
var mentions:Mention[] = []

var message = new Message(messageidcounter++,'test message')
messagecontainer.appendChild(message.render())
messages.push(message)

function sendMessage(){
    var message = new Message(messageidcounter++,textarea.value)
    messagecontainer.appendChild(message.render())
    messages.push(message)
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


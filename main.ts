/// <reference path="node_modules/vectorx/vector.ts" />
/// <reference path="node_modules/utilsx/utils.ts" />

class Message{
    createdAt:Date = new Date()

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
            mentions.push(new Mention(mentionidcounter++,this.id,parseInt(item[1])))
        }

        var replaceresult = this.text.replace(regex,(substring,p1) => {
            return `<a href="#${p1}">${substring}</a>`
        })

        return `
            <div style="border:1px solid black; margin:10px 0px; padding:10px; max-width:700px; max-height:200px; overflow:auto;">
                <a href="#${this.id}">${this.id}</a>
                <pre style="font-family:Arial, Helvetica, sans-serif;">${replaceresult}</pre>
            </div>
        `
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

var message = new Message(messageidcounter++,'test message',[])
messagecontainer.insertAdjacentHTML('beforeend',message.render())

this.sendbtn.addEventListener('click',e => {
    var message = new Message(messageidcounter++,textarea.value,[])
    messagecontainer.insertAdjacentHTML('beforeend',message.render())
    textarea.value = ''
})
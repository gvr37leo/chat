var closehoveronmouseleave = false

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

class Mention{
    constructor(
        public id:number,
        public originalMessage:number,
        public mentionedMessage:number,
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

function renderMessage(id:number,previewLinks:boolean,onlinkClick:() => void):HTMLElement{
    var mentions = findMentions(id)
    var replies = findReplies(id)
    var message = findMessage(id)
    var regex = />>([0-9]{1,6})/g

    var replieselements = replies.map(rep => {
        var element = string2html(`<a style="margin-right:10px;" href="#${rep.originalMessage}">${rep.originalMessage}</a>`)
        if(previewLinks){
            addPreviewAndConversationLink(element,rep.originalMessage,onlinkClick)
        }
        return element
    })

    var replaceresult = message.text.replace(regex,(substring,p1) => {
        return `<a href="#${p1}" data-messageid="${p1}">${substring}</a>`
    })

    var html = string2html(`
        <div style="border:1px solid black; margin:10px 0px; padding:10px; max-width:700px; max-height:200px; overflow:auto; background-color: white;">
            <a name="${message.id}" href="#${message.id}">${message.id}</a> <span>${message.createdAt.toLocaleTimeString()}</span> replies <span id="replies"></span>
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
            addPreviewAndConversationLink(mention,parseInt(mention.dataset.messageid),onlinkClick)
        }
    }
    return html
}

function addPreviewAndConversationLink(linkelement:HTMLElement,targetmessageid:number,onlinkClick:() => void){
    if(findMessage(targetmessageid) == null){
        return
    }else{
        linkelement.addEventListener('mouseenter', e => {
            setCursorFloater(linkelement, targetmessageid)
        })

        linkelement.addEventListener('mouseleave',e => {
            if(closehoveronmouseleave){
                cursorfloater.style.display = 'none'
            }
        })


        linkelement.addEventListener('click', e => {
            e.preventDefault()
            onlinkClick()
        })
    }
}

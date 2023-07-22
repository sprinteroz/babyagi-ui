javascript:function parseChatGPTData(data) { const mapping = data.mapping; const conversationTitle = data.title; const createDate = new Date(data.create_time * 1000).toISOString().slice(0, 10); const messagesArray = Object.values(mapping) .filter(node => node.message) .map(node => { const message = node.message; const sender = message.author.role === 'user' ? 'You' : 'Assistant'; const content = message.content.parts.join(''); const createTime = message.create_time; return { sender: sender, content: content, createTime: createTime, }; }); messagesArray.sort((a, b) => a.createTime - b.createTime); return { date: createDate, title: conversationTitle, messages: messagesArray.map(({ sender, content }) => ({ sender, content })), }; } function download(filename, text) { const element = document.createElement('a'); element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text)); element.setAttribute('download', filename); element.style.display = 'none'; document.body.appendChild(element); element.click(); document.body.removeChild(element); } function formatMessages(messages) { return messages .map(message => `**${message.sender}**: ${message.content}`) .join('\n\n'); } function saveGPT(data) { const conversation = parseChatGPTData(data); const filename = `${conversation.date}-${conversation.title}.md`; const formattedMessages = formatMessages(conversation.messages); download(filename, formattedMessages); } const originalFetch = window.fetch; window.fetch = async function (input, init) { const response = await originalFetch(input, init); if ( typeof input === 'string' && input.includes('/conversation/') && (!init || (init && init.method === 'GET')) ) { const clonedResponse = response.clone(); clonedResponse.json().then(data => { saveGPT(data); }); } return response; };
const encoder=new TextEncoder();
export function splitTranslationText(text,maxBytes=480){
 const chunks=[];let current='';
 for(const word of text.match(/\S+\s*|\s+/gu)||[]){
  if(encoder.encode(current+word).length<=maxBytes){current+=word;continue;}
  if(current){chunks.push(current);current='';}
  if(encoder.encode(word).length<=maxBytes){current=word;continue;}
  for(const char of word){if(encoder.encode(current+char).length>maxBytes){chunks.push(current);current='';}current+=char;}
 }
 if(current)chunks.push(current);return chunks;
}
export async function translateText(text,{fetcher=globalThis.fetch,signal}={}){
 const output=[];
 for(const chunk of splitTranslationText(text)){
  const url=new URL('https://api.mymemory.translated.net/get');url.searchParams.set('q',chunk);url.searchParams.set('langpair','en|zh-CN');
  const response=await fetcher(url.href,{signal});
  if(!response.ok)throw new Error('在线翻译暂时无法连接，请稍后重试或手动补充译文。');
  const data=await response.json();
  if(data.quotaFinished||Number(data.responseStatus)===403||Number(data.responseStatus)===429)throw new Error('在线翻译已达到服务限额，请稍后再试；内置译文仍可正常查看。');
  if(Number(data.responseStatus)!==200||!data.responseData?.translatedText||/MYMEMORY WARNING|QUOTA EXCEEDED/i.test(data.responseData.translatedText))throw new Error('翻译服务暂时没有返回有效译文，请稍后重试。');
  output.push(data.responseData.translatedText.trim());
 }
 return output.join(' ');
}

export const letters=['A','B','C','D'];
let idSequence=0;
export function createExerciseId(api=globalThis.crypto){return api?.randomUUID?.()||`exercise-${Date.now().toString(36)}-${(++idSequence).toString(36)}-${Math.random().toString(36).slice(2,10)}`;}
export const escapeHtml=s=>String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
export function parseQuestions(text){
 const blocks=text.replace(/\r/g,'').split(/(?:^|\n)\s*(?:Question\s*)?\d+[.、)）．]\s*/i).filter(x=>x.trim());
 return blocks.map(block=>{
  // Only normalize inline choices before metadata. Letters inside explanations are plain text.
  const boundary=block.search(/(?:^|\n)\s*(?:答案|正确答案|Answer|依据|原文依据|Evidence|解析|Explanation)\s*[:：]/i);
  let head=boundary<0?block:block.slice(0,boundary);
  const tail=boundary<0?'':block.slice(boundary);
  const lineOptions=head.match(/(?:^|\n)\s*[A-D][)）.、．]\s*/g)||[];
  if(lineOptions.length<4)head=head.replace(/\s+([A-D])[)）.、．]\s*/g,'\n$1) ');
  const q={prompt:'',options:['','','',''],answer:'',evidence:-1,explanation:''};let field='prompt',metadata=false;
  for(const raw of (head+'\n'+tail).split('\n')){const line=raw.trim();if(!line)continue;
   let m=line.match(/^(?:答案|正确答案|Answer)\s*[:：]\s*([A-D])/i);if(m){q.answer=m[1].toUpperCase();field='ignored';metadata=true;continue;}
   m=line.match(/^(?:依据|原文依据|Evidence)\s*[:：]\s*(?:第\s*)?(\d+)/i);if(m){q.evidence=Number(m[1])-1;field='ignored';metadata=true;continue;}
   m=line.match(/^(?:解析|Explanation)\s*[:：]\s*(.*)/i);if(m){q.explanation=m[1];field='explanation';metadata=true;continue;}
   m=!metadata&&line.match(/^([A-D])[)）.、．]\s*(.*)/);if(m){field=letters.indexOf(m[1]);q.options[field]=m[2];continue;}
   if(typeof field==='number')q.options[field]+=' '+line;else if(field!=='ignored')q[field]+=(q[field]?' ':'')+line;
  }return q;
 }).filter(q=>q.prompt||q.options.some(Boolean));
}
export function validateExercise(e){
 if(!e.title?.trim())return '请填写文章标题';
 if(!Array.isArray(e.paragraphs)||!e.paragraphs.length||e.paragraphs.some(p=>!p.trim()))return '请粘贴文章，段落之间用空行分隔';
 if(!e.questions?.length)return '未识别到题目，请按示例格式粘贴';
 for(let i=0;i<e.questions.length;i++){const q=e.questions[i],n=`第 ${i+1} 题`;
  if(!q.prompt.trim()||q.options.length!==4||q.options.some(o=>!o.trim()))return `${n}需要题干和 A–D 四个选项`;
  if(!letters.includes(q.answer))return `${n}请选择正确答案`;
  if(!Number.isInteger(q.evidence)||q.evidence<0||q.evidence>=e.paragraphs.length)return `${n}请选择原文依据段落`;
  if(!q.explanation?.trim())return `${n}请补充解析，供作答后查看`;
 }return '';
}
export function extractVocab(text,glossary){
 return glossary.filter(v=>{
  const term=v.term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const suffix=v.term.includes(' ')?'':'(?:s|es|d|ed|ing)?';
  return [term,...(v.forms||[])].some(form=>new RegExp('\\b'+form+suffix+'\\b','i').test(text));
 });
}
export function grade(questions,answers){
 let submitted=0,correct=0;questions.forEach((q,i)=>{if(answers[i]?.submitted){submitted++;if(answers[i].choice===q.answer)correct++;}});
 return {submitted,correct,total:questions.length,complete:submitted===questions.length};
}
export function filterCollection(items,{kind='all',year='all',query=''}={}){
 const q=query.trim().toLowerCase();return items.filter(e=>(kind==='all'||e.kind===kind)&&(year==='all'||String(e.year)===String(year))&&(!q||[e.title,e.subtitle,e.category,e.year,e.source].join(' ').toLowerCase().includes(q)));
}
export function parseTranslations(text,count){
 if(!text.trim())return [];
 const parts=text.trim().split(/\n\s*\n/).map(p=>p.trim().replace(/\n/g,' '));
 if(parts.length!==count)throw new Error(`译文有 ${parts.length} 段，原文有 ${count} 段。请用空行逐段对应，或先留空。`);
 return parts;
}

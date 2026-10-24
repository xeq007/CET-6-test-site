import test from 'node:test';
import assert from 'node:assert/strict';
const c = await import('../dist/core.mjs').catch(()=>({}));
import {glossary} from '../dist/data.mjs';
test('parser handles numbered questions and preserves multiline options',()=>{
 assert.equal(typeof c.parseQuestions,'function');
 const q=c.parseQuestions('46. Why is access important?\nA) It saves time.\nB) It provides opportunity\nfor participation.\nC) It removes all barriers.\nD) It costs nothing.\n答案：B\n依据：2\n解析：Participation is the key.');
 assert.equal(q.length,1); assert.equal(q[0].answer,'B'); assert.equal(q[0].evidence,1); assert.equal(q[0].options[1],'It provides opportunity for participation.');
});
test('parser supports inline options and multiple question numbers',()=>{
 const q=c.parseQuestions('1. What matters? A. Access B. Wealth C. Age D. Speed\nAnswer: A\nEvidence: 1\nExplanation: Access matters.\n2. What follows?\nA) Growth\nB) Loss\nC) Time\nD) Doubt\n答案：C');
 assert.equal(q.length,2);assert.deepEqual(q[0].options,['Access','Wealth','Age','Speed']);assert.equal(q[1].answer,'C');
});
test('validation rejects missing answer or invalid evidence rather than inventing analysis',()=>{
 const e={title:'Custom',paragraphs:['Text.'],questions:[{prompt:'Why?',options:['A','B','C','D'],answer:'',evidence:0,explanation:'Because.'}]};
 assert.match(c.validateExercise(e),/答案/);e.questions[0].answer='A';e.questions[0].evidence=2;assert.match(c.validateExercise(e),/依据/);e.questions[0].evidence=0;assert.equal(c.validateExercise(e),'');
});
test('review vocabulary finds whole words, phrases and inflected forms only',()=>{
 const glossary=[{term:'access',meaning:'获取'},{term:'take for granted',meaning:'认为理所当然'},{term:'barrier',meaning:'障碍'}];
 assert.deepEqual(c.extractVocab('Access is taken seriously. We take for granted that barriers vanish. Inaccessible.',glossary).map(x=>x.term),['access','take for granted','barrier']);
 assert.equal(c.extractVocab('inaccessible',glossary).length,0);
});
test('grading counts only submitted responses and requires all questions for completion',()=>{
 const qs=[{answer:'A'},{answer:'C'}];
 assert.deepEqual(c.grade(qs,{0:{choice:'A',submitted:true},1:{choice:'C',submitted:false}}),{submitted:1,correct:1,total:2,complete:false});
 assert.deepEqual(c.grade(qs,{0:{choice:'B',submitted:true},1:{choice:'C',submitted:true}}),{submitted:2,correct:1,total:2,complete:true});
});
test('exercise creation still produces distinct IDs when randomUUID is unavailable',()=>{
 assert.equal(typeof c.createExerciseId,'function');
 const ids=Array.from({length:1000},()=>c.createExerciseId({}));
 assert.equal(new Set(ids).size,1000);assert.ok(ids.every(x=>typeof x==='string'&&x.length>10));
});
test('the sample passive phrase is included under its canonical vocabulary entry',()=>{
 assert.ok(c.extractVocab('Digital access is often taken for granted.',glossary).some(v=>v.term==='take for granted'));
});
test('option letters in explanations and ordinary multiline option text are preserved',()=>{
 const qs=c.parseQuestions('1. What does the author support?\nA) A source of vitamin D.\nB) Participation\nC) Other claims\nD) No claims\nAnswer: B\nEvidence: 1\nExplanation: The author supports option B. The other claims are not supported.\nC. is a distractor.');
 assert.equal(qs[0].options[0],'A source of vitamin D.');
 assert.equal(qs[0].options[1],'Participation');
 assert.equal(qs[0].explanation,'The author supports option B. The other claims are not supported. C. is a distractor.');
});

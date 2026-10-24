import test from 'node:test';
import assert from 'node:assert/strict';
import {validateExercise} from '../dist/core.mjs';
const core=await import('../dist/core.mjs');
const data=await import('../dist/collection.mjs').catch(()=>({}));
test('practice collection includes complete original exercises with aligned translations and actual evidence',()=>{
 assert.ok(Array.isArray(data.builtInExercises));assert.equal(data.builtInExercises.length,6);
 const ids=new Set();for(const e of data.builtInExercises){assert.equal(validateExercise(e),'');assert.equal(e.kind,'mock');assert.equal(e.translations.length,e.paragraphs.length);assert.ok(e.translations.every(x=>x.length>15));assert.ok(!ids.has(e.id));ids.add(e.id);for(const q of e.questions)assert.ok(e.paragraphs[q.evidence].includes(q.quote));}
});
test('paper sources stay clearly separate from locally answerable exercises',()=>{
 assert.equal(data.pastPapers.length,10);assert.deepEqual([...new Set(data.pastPapers.map(p=>p.year))],[2025,2024,2023,2022,2021]);
 for(const p of data.pastPapers){assert.equal(p.kind,'past-source');assert.ok(p.sourceUrl.startsWith('https://'));assert.equal(p.paragraphs,undefined);}
});
test('search and year filters select sources without mixing in mock questions',()=>{
 assert.equal(typeof core.filterCollection,'function');
 const list=[{kind:'mock',title:'Urban trees',category:'环境'},{kind:'past-source',year:2024,title:'2024年6月 第1套'},{kind:'past-source',year:2025,title:'2025年12月 第1套'}];
 assert.deepEqual(core.filterCollection(list,{kind:'past-source',year:'2024',query:'6月'}),[list[1]]);
 assert.deepEqual(core.filterCollection(list,{kind:'mock',query:'环境'}),[list[0]]);
});
test('optional imported translations reject misaligned paragraph counts',()=>{
 assert.equal(typeof core.parseTranslations,'function');
 assert.deepEqual(core.parseTranslations('',2),[]);
 assert.deepEqual(core.parseTranslations('第一段译文\n\n第二段译文',2),['第一段译文','第二段译文']);
 assert.throws(()=>core.parseTranslations('只有一段',2),/段/);
});

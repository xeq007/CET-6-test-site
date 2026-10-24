import test from 'node:test';
import assert from 'node:assert/strict';
const t=await import('../dist/translation.mjs').catch(()=>({}));
test('translation segments preserve all source text within the API byte limit',()=>{
 assert.equal(typeof t.splitTranslationText,'function');
 for(const text of ['Reliable digital access. '.repeat(50),'a'.repeat(1200),'学习 English 🌿 '.repeat(100)]){const chunks=t.splitTranslationText(text);assert.equal(chunks.join(''),text);assert.ok(chunks.every(s=>new TextEncoder().encode(s).length<=480));}
});
test('successful translation sends en to zh-CN requests and combines all segments',async()=>{
 const requested=[];const translated=await t.translateText('A short sentence.',{fetcher:async url=>{requested.push(new URL(url));return {ok:true,json:async()=>({responseStatus:200,responseData:{translatedText:'一句短句。'}})};}});
 assert.equal(translated,'一句短句。');assert.equal(requested[0].searchParams.get('langpair'),'en|zh-CN');assert.equal(requested[0].searchParams.get('q'),'A short sentence.');
});
test('quota and service failures are surfaced instead of saved as translated prose',async()=>{
 await assert.rejects(()=>t.translateText('Test',{fetcher:async()=>({ok:true,json:async()=>({responseStatus:403,quotaFinished:true,responseData:{translatedText:'QUOTA EXCEEDED'}})})}),/限额/);
 await assert.rejects(()=>t.translateText('Test',{fetcher:async()=>({ok:false,status:503})}),/暂时/);
});

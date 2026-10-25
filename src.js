import './styles.css';
const $=s=>document.querySelector(s);let verses=[],studyData={R:[],U:[]},nameData=[],tab='search',mode='righteous',filter='all',query='',selected=null;const cats={what_god_does:'What God Does',results_of_righteous:'Results in Life',identity_in_him:'Identity in Him',character_of_righteous:'Character of the Righteous'};const load=(key,def)=>{try{return JSON.parse(localStorage.getItem(key))??def}catch{return def}};let favorites=load('rl-favorites',[]),studies=load('rl-studies',[]);const persist=(key,value)=>localStorage.setItem(key,JSON.stringify(value));const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Bible Hub passage URLs use lowercase book names and chapter-verse paths.
// Examples: Psalm 1:3 -> https://biblehub.com/psalms/1-3.htm
//           1 Peter 2:24 -> https://biblehub.com/1_peter/2-24.htm
function bibleHubUrl(reference){
  const match=String(reference).trim().match(/^((?:[1-3]\s*)?[A-Za-z]+(?:\s+[A-Za-z]+)*)\s+(\d+):(\d+)/);
  if(!match)return 'https://biblehub.com/';
  const aliases={psalm:'psalms',song_of_songs:'songs',song_of_solomon:'songs'};
  const book=match[1].trim().toLowerCase().replace(/\s+/g,'_');
  return `https://biblehub.com/${aliases[book]||book}/${match[2]}-${match[3]}.htm`;
}
const passageLink=reference=>`<a class="subtle" href="${esc(bibleHubUrl(reference))}" target="_blank" rel="noopener noreferrer" aria-label="Read ${esc(reference)} on Bible Hub">📖 Open Passage ↗</a>`;
const find=ref=>verses.find(v=>v.reference.toLowerCase()===ref.toLowerCase());const card=v=>`<article class="verse-card"><div class="card-top"><span class="reference">${esc(v.reference)}</span><span class="category">${esc(cats[v.category])}</span></div><p>${esc(v.summary)}</p><div class="card-foot"><span>${esc(v.theme)}</span><div><button class="subtle" data-save="${esc(v.reference)}" aria-label="Save ${esc(v.reference)}">${favorites.includes(v.reference)?'★ Saved':'☆ Save'}</button>${passageLink(v.reference)}<button class="subtle" data-open="${esc(v.reference)}">Study →</button></div></div></article>`;
function shell(){ $('#app').innerHTML=`<header class="topbar"><div class="brand"><img src="/icon-192.png" alt=""><div><strong>RightLens</strong><small>See life through Scripture</small></div></div><span class="offline">● Eyes Open </span></header><main><section class="hero"><div class="hero-content"><span class="eyebrow">SCRIPTURE · STUDY · UNDERSTANDING</span><h1>See life through<br>the lens of <em>righteousness.</em></h1><p>Explore God's Word, follow connected passages, and build your own study of two paths.</p><button id="hero-start" class="gold-btn">Explore Scripture <span>↗</span></button></div></section><nav class="tabs" aria-label="Main navigation"><button data-tab="search">⌕ Scripture</button><button data-tab="bible">📖 Full Bible</button><button data-tab="breakdown">◫ Breakdown</button><button data-tab="rvu">⚖ R vs U</button><button data-tab="names">✧ Your Name</button><button data-tab="prayer">♡ Ask for a Right-Prayer Word</button><button data-tab="saved">☆ Saved</button><button data-tab="about">ⓘ About</button></nav><div id="content"></div></main><footer>RightLens · A Scripture-first study companion · Study summaries are not Bible quotations.</footer><div id="detail"></div><div id="install"></div>`;$('#hero-start').onclick=()=>{tab='search';render();$('.tabs').scrollIntoView({behavior:'smooth'})};document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;selected=null;render()});render();installBanner()}
function render(){document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));if(tab==='search')renderSearch();else if(tab==='bible')renderBible();else if(tab==='breakdown')renderBreakdown();else if(tab==='rvu')renderRVU();else if(tab==='names')renderNames();else if(tab==='prayer')renderPrayer();else if(tab==='saved')renderSaved();else renderAbout();bindActions()}
function renderSearch(){let filtered=verses.filter(v=>(filter==='all'||v.category===filter)&&(!query||[v.reference,v.theme,v.summary,v.category].join(' ').toLowerCase().includes(query.toLowerCase())));$('#content').innerHTML=`<section class="section-heading"><span class="eyebrow dark">DISCOVER</span><h2>Explore the Word</h2><p>Search curated references and study notes. </p></section><div class="search-panel"><label for="q">Search Scripture references, themes or notes</label><div class="searchline"><span>⌕</span><input id="q" type="search" placeholder="Try: protection, peace, Psalm 34..." value="${esc(query)}"><button id="clear" class="subtle">Clear</button></div><div class="mode"><span>Righteous Lens · curated index</span></div><div class="chips">${[['all','All categories'],...Object.entries(cats)].map(([k,n])=>`<button data-filter="${k}" class="chip ${filter===k?'on':''}">${esc(n)}</button>`).join('')}</div></div><div class="results-head"><span>${filtered.length>30?'Showing first 30 · refine your search':''}</span></div><div class="cards">${filtered.slice(0,30).map(card).join('')||'<p>No indexed matches. Try a different topic or reference.</p>'}</div>`;$('#q').oninput=e=>{query=e.target.value;renderSearch();$('#q').focus();$('#q').setSelectionRange(query.length,query.length);bindActions()};$('#clear').onclick=()=>{query='';render()};document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{filter=b.dataset.filter;render()})}
function renderBreakdown(){
 $('#content').innerHTML=`<section class="section-heading"><span class="eyebrow dark">SCRIPTURE STUDY</span><h2>Righteousness Breakdown</h2><p>Explore the contrast between righteousness and wickedness in Scripture.</p></section><div class="comparison"><div><span class="compare-tag positive">THE RIGHTEOUS</span><h3>Psalm 1:3</h3><p>Fruitful tree beside streams of water</p><small>Stability · fruitfulness · wisdom</small></div><div><span class="compare-tag negative">THE WICKED</span><h3>Psalm 1:4</h3><p>Chaff driven away by the wind</p><small>Instability · judgment · contrast</small></div></div><p class="disclaimer">Read each passage in its full context. Use the R vs U tab to explore the built-in research collection.</p>`;
}

let collection='R';
function renderRVU(){
 const items=studyData[collection]||[];
 const secretPassages=[
  ['Deuteronomy 29:29','The secret things belong to the Lord, while what He reveals is given to His people so they may follow His Word.'],
  ['Proverbs 3:32','The Lord shares His counsel and close friendship with the upright.'],
  ['Psalm 25:14','Those who fear the Lord are welcomed into His friendship, and He makes His covenant known to them.'],
  ['Job 29:4',"Job remembers a season when God's intimate friendship rested upon his household."]
 ];
 const secrets=collection==='R'?`<section class="secrets-panel"><span class="eyebrow dark">SECRETS STUDY</span><h3>The Righteous Are Entrusted With God’s Secrets</h3><div class="secrets-passages">${secretPassages.map(([ref,note])=>`<p><strong>${esc(ref)}</strong> — ${esc(note)} ${passageLink(ref)}</p>`).join('')}</div><p>God invites the upright into His counsel and friendship. He reveals what He chooses to reveal; these passages do not say that every divine secret is disclosed or that God never speaks to others. Enjoy finding the Right word for you today!</p></section>`:'';
 $('#content').innerHTML=`<section class="section-heading"><span class="eyebrow dark">TWO PATHS · ONE SCRIPTURE</span><h2>R vs U</h2><p>Compare what scripture says about the Righteous (R) and the Unrighteous (U). There is a Way described about each type.</p></section><div class="study-switch"><button class="chip ${collection==='R'?'on':''}" data-collection="R">R · Righteous (${studyData.R.length})</button><button class="chip ${collection==='U'?'on':''}" data-collection="U">U · SWord (${studyData.U.length})</button></div>${secrets}<p class="collection-count">${items.length} research entries</p><div class="cards">${items.map(x=>`<article class="verse-card"><div class="card-top"><span class="reference">${esc(x.reference)}</span><span class="category">${collection}</span></div><p>${esc(x.note||'Research reference')}</p><div class="card-foot">${x.section&&!/^(?:Clean|Names|SWord|Secrets)!\$?[A-Z]+\$?\d+$/i.test(x.section)?`<small>${esc(x.section)}</small>`:""}${passageLink(x.reference)}</div></article>`).join('')||'<div class="empty">No entries available.</div>'}</div><p class="disclaimer">Original research notes are shown as supplied, not verified ESV quotations. Check the passage and context before relying on an interpretation.</p>`;
 document.querySelectorAll('[data-collection]').forEach(b=>b.onclick=()=>{collection=b.dataset.collection;renderRVU()});
}

// Presentation-only cleanup: preserve the complete research source in /public/names.json.
// Use original worksheet cell IDs to distinguish repeated reference-only entries.
const nameReplacements={
 'B7':'Imitator of God\n(Ephesians 5:1)',
 'F7':'Loved One\n(Romans 9:25)',
 'B8':'Right-doer\n(1 John 3:10)',
 'A9':'Faith-filled Brother & Faith-filled Sister\n(Colossians 1:2)',
 'B10':'Righteousness of God\n(2 Corinthians 5:21)',
 'A11':'Healthy & Well\n(Mark 2:17)',
 'A12':'Wise & Enlightened\n(Ephesians 1:17)',
 'B12':'Wise Children\n(Luke 7:35)',
 'F12':'Sign & Symbol\n(Isaiah 8:18)',
 'F13':'Instrument of Special Purpose\n(2 Timothy 2:21)',
 'C14':'Holy & Clean\n(2 Timothy 2:21 & 1 Peter 2:9 & 1 Corinthians 3:17)',
 'F16':'Shine in the Land\n(Zechariah 9:16)',
 'E19':'Sign & Wonder\n(Psalm 71:7)',
 'C13':'Chosen\n(Revelation 17:14)',
 'E20':'Chosen Ones\n(Revelation 17:14)',
 'E21':'Faith-filled Ones\n(Revelation 17:14)'
};
const nameHiddenCells=new Set(['A1','B1','G1','B9','A10','B11','G12','G14','G16','F19','G19','F20','F21','E23','F23','E24','F24']);
function visibleNames(){
 const result=[];
 for(const item of nameData){
  if(nameHiddenCells.has(item.cell))continue;
  const text=nameReplacements[item.cell]||item.text;
  result.push({text});
  if(item.cell==='B8')result.push({text:'Love-filled (for others)\n(1 John 3:10)'});
  if(item.cell==='F13')result.push({text:'Ready for Good Work\n(2 Timothy 2:21)'});
  if(item.cell==='E21')result.push({text:'Called Ones\n(Revelation 17:14)'});
 }
 return result;
}
function renderNames(){
 $('#content').innerHTML=`<section class="section-heading"><span class="eyebrow dark">IDENTITY THROUGH CHRIST</span><h2>Your Name</h2><p>God names His people.</p></section><div class="names-grid">${visibleNames().map(x=>`<article class="name-tile"><span>${esc(x.text).replace(/\n/g,'<br>')}</span></article>`).join('')}</div><section class="ekklesia"><span class="eyebrow">CALLED OUT · CALLED INTO</span><h2>We Are His Ekklesia</h2><p><strong>Ek</strong> means “out of/from” and <strong>kaleō</strong> means “to call.” <em>Ekklēsia</em> means assembly or congregation; “called out and into” is a theological application, not a literal dictionary definition.</p><p>Darkness → His marvelous light (1 Peter 2:9)<br>Domain of darkness → Kingdom of His beloved Son (Colossians 1:13)<br>Slavery to sin → Service to righteousness (Romans 6:17–18)<br>Death → Life (John 5:24)<br>Far off → Brought near (Ephesians 2:13)</p><h3>Through one name: JESUS</h3><p>God does not merely call us out of what we were. Through Jesus Christ, He brings us into who He has called us to be. (Matthew 1:21; Acts 4:12)</p></section>`;
}


// Version 1 is an on-device journal and a curated, explainable Scripture matcher.
// Public publishing and full-Bible/AI search remain disabled until secure backend and review exist.
const prayerThemes=[
 {keys:['worr','anx','afraid','fear','stress','peace','uncertain','future'],title:'You Are Invited to Trust Him',words:['peace','trust','fear','comfort','anxiety'],references:['Philippians 4:6','Isaiah 26:3','1 Peter 5:7'],names:['Friend','Bold','Redeemed']},
 {keys:['lonely','alone','friend','isolat','rejection'],title:'You Are Not Forgotten',words:['friend','love','near','belong'],references:['Psalm 34:18','John 15:15','Hebrews 13:5'],names:['Friend','Bride of Christ','Saints']},
 {keys:['sick','health','heal','pain','hospital','diagnos'],title:'You Can Bring Your Needs to Him',words:['strength','comfort','hope','help'],references:['Psalm 34:18','James 5:14','2 Corinthians 12:9'],names:['Beloved','Friend','Redeemed']},
 {keys:['work','job','money','financ','provide','debt'],title:'You Can Seek His Wisdom',words:['wisdom','provide','work','help'],references:['James 1:5','Matthew 6:33','Philippians 4:6'],names:['Handiwork','Ambassador','Friend']},
 {keys:['guilt','shame','forgiv','sin','mistake'],title:'You Are Invited to Receive His Mercy',words:['forgive','mercy','grace','redeem'],references:['1 John 1:9','Romans 8:1','Ephesians 1:7'],names:['Redeemed','Saints','Friend']},
 {keys:['purpose','identity','worth','calling','direction'],title:'You Are Invited to Walk in His Calling',words:['identity','called','purpose','life'],references:['Ephesians 2:10','1 Peter 2:9','John 15:15'],names:['Handiwork','Ambassador','Friend']}
];
const prayerStore='rl-private-prayer-journal-v1';
function prayerEntries(){return load(prayerStore,[]).filter(x=>x&&typeof x.request==='string'&&Array.isArray(x.refs)).slice(0,40)}
const prayerStopWords=new Set('about after again also always because being could family father have help just like looking more much need other please prayer really should someone something their there these things this those through today want what when where which while with would your'.split(' '));
const prayerPatterns=[
 {id:'family',pattern:/\b(wife|husband|marriage|married|spouse|divorce|relationship|son|daughter|children|child|kids|parent|mother|father|brother|sister|family)\b/i,title:'God Is Near to Your Family',refs:['Joshua 24:15','Colossians 3:13','Psalm 127:3','James 1:5'],names:['Beloved','Friend','Children of God'],prayer:'Bring peace, patience, and love into these relationships. Give each person wisdom to listen, forgive, and care for one another.'},
 {id:'future',pattern:/\b(future|direction|decision|decisions|unknown|uncertain|next step|guidance|choose|choice|tomorrow)\b/i,title:'You Can Trust Him With What Comes Next',refs:['Proverbs 3:5','Jeremiah 29:11','James 1:5','Psalm 32:8'],names:['Friend','Handiwork','Ambassador'],prayer:'Give clarity for the decisions ahead, courage for the next step, and peace when the path is not yet clear.'},
 {id:'work',pattern:/\b(job|work|career|employment|boss|business|interview|layoff|unemployed|income|paycheck|finances|financial|money|debt|rent|bills|provision)\b/i,title:'God Sees Your Work and Your Needs',refs:['Philippians 4:19','James 1:5','Matthew 6:33','Colossians 3:23'],names:['Handiwork','Ambassador','Beloved'],prayer:'Provide what is needed, open wise opportunities, and give diligence and peace in work and finances.'},
 {id:'health',pattern:/\b(health|sick|sickness|illness|healing|heal|hospital|doctor|diagnosis|diagnosed|pain|cancer|surgery|disease|injury|recover|recovery)\b/i,title:'You Can Find Strength in His Presence',refs:['Psalm 46:1','James 5:14','2 Corinthians 12:9','Psalm 34:18'],names:['Beloved','Friend','Redeemed'],prayer:'Bring comfort and strength through this health concern, wisdom to those providing care, and hope for each day.'},
 {id:'grief',pattern:/\b(grief|grieving|died|death|passed away|funeral|loss|lost someone|mourning|miss him|miss her)\b/i,title:'God Is Near to the Brokenhearted',refs:['Psalm 34:18','Matthew 5:4','Revelation 21:4','Psalm 147:3'],names:['Beloved','Friend','Children of God'],prayer:'Comfort every grieving heart, sustain them through sorrow, and surround them with love and faithful support.'},
 {id:'fear',pattern:/\b(anxiety|anxious|afraid|fear|fearful|worry|worried|stress|stressed|panic|overwhelmed|nervous|peace)\b/i,title:'You Are Invited Into His Peace',refs:['Philippians 4:6','Isaiah 41:10','1 Peter 5:7','John 14:27'],names:['Friend','Beloved','Children of God'],prayer:'Quiet anxious thoughts, renew courage, and remind this person that they do not have to face fear alone.'},
 {id:'lonely',pattern:/\b(lonely|alone|isolated|rejected|abandoned|friendless|belong|friendship)\b/i,title:'You Are Not Forgotten',refs:['Hebrews 13:5','John 15:15','Psalm 34:18','Romans 8:38'],names:['Friend','Beloved','Saints'],prayer:'Bring companionship, healing from rejection, and a deep assurance of Your presence and love.'},
 {id:'forgiveness',pattern:/\b(guilt|guilty|shame|ashamed|sin|forgive|forgiveness|repent|mistake|regret|temptation)\b/i,title:'You Can Receive His Mercy',refs:['1 John 1:9','Romans 8:1','Ephesians 1:7','Psalm 103:12'],names:['Redeemed','Beloved','Saints'],prayer:'Lead this person toward repentance where needed, confidence in Your mercy, and freedom to walk in a renewed way.'},
 {id:'purpose',pattern:/\b(purpose|calling|identity|worth|meaning|directionless|useless|confidence|self-esteem)\b/i,title:'You Are His Handiwork',refs:['Ephesians 2:10','1 Peter 2:9','Psalm 139:14','2 Corinthians 5:17'],names:['Handiwork','Ambassador','Beloved'],prayer:'Show this person their value in Christ and guide them toward the good work You have prepared.'}
];
// Curated relevance associations. Never randomize or penalize previously shown names.
const prayerIdentityRules=[
 {name:'Beloved',topics:['family','grief','fear','lonely','health','forgiveness'],words:['love','loved','unwanted','abandoned','rejected','marriage','spouse','wife','husband']},
 {name:'Friend',topics:['lonely','family','fear','future','grief'],words:['friend','alone','lonely','companionship','abandoned','trust']},
 {name:'Redeemed',topics:['forgiveness','grief','health','purpose'],words:['sin','guilt','shame','mercy','forgive','past','regret','restore']},
 {name:'Handiwork',topics:['purpose','future','work'],words:['purpose','future','career','job','work','calling','direction','decisions']},
 {name:'Imitator of God',topics:['family','purpose','forgiveness'],words:['example','lead','leadership','parent','father','mother','children','family','marriage','character']},
 {name:'Child of God',topics:['family','fear','lonely','grief'],words:['child','children','son','daughter','family','belong','identity','safe']},
 {name:'Children of God',topics:['family','fear','lonely','grief'],words:['children','family','belong','identity','safe']},
 {name:'Chosen',topics:['purpose','lonely','future'],words:['chosen','rejected','worth','calling','direction','purpose']},
 {name:'Saints',topics:['forgiveness','purpose','lonely'],words:['holy','clean','temptation','faith','identity']},
 {name:'Ambassador',topics:['work','purpose','future'],words:['lead','serve','mission','work','job','career','calling']},
 {name:'Righteousness of God',topics:['forgiveness','purpose'],words:['righteous','forgive','guilt','shame','identity']},
 {name:'Holy & Clean',topics:['forgiveness','purpose'],words:['clean','sin','shame','guilt','temptation','purity']},
 {name:'Wise & Enlightened',topics:['future','work','family'],words:['wisdom','wise','decision','decisions','choose','choice','guidance','understanding']},
 {name:'Ready for Good Work',topics:['work','purpose','future'],words:['opportunity','work','career','serve','calling','future']},
 {name:'Loved One',topics:['lonely','grief','family','fear'],words:['loved','love','alone','rejected','abandoned','marriage']},
 {name:'Faith-filled Ones',topics:['fear','future','grief'],words:['faith','trust','uncertain','afraid','fear','courage']},
 {name:'Instrument of Special Purpose',topics:['purpose','work'],words:['purpose','calling','serve','mission','work']}
];
function prayerIdentityCatalog(){
 return visibleNames().map(item=>{
  const lines=String(item.text).split('\n');
  const label=lines[0].trim();
  const reference=(lines.slice(1).join(' ').match(/\(([^)]+)\)/)||[])[1]||'';
  return {label,reference};
 }).filter(x=>x.label&&x.reference);
}
function prayerFourNames(request,matched){
 const catalog=prayerIdentityCatalog(),lower=request.toLowerCase();
 const tokens=new Set((lower.match(/[a-z]+/g)||[]));
 const topics=new Map(matched.map(t=>[t.id,t.score]));
 const scored=catalog.map((item,i)=>{
  const rule=prayerIdentityRules.find(r=>r.name.toLowerCase()===item.label.toLowerCase());
  const topicScore=rule?rule.topics.reduce((n,t)=>n+(topics.get(t)||0)*7,0):0;
  const wordScore=rule?rule.words.reduce((n,w)=>n+(tokens.has(w)?4:0),0):0;
  const labelScore=item.label.toLowerCase().split(/\W+/).reduce((n,w)=>n+(w.length>3&&tokens.has(w)?2:0),0);
  return {...item,score:topicScore+wordScore+labelScore,i};
 });
 scored.sort((a,b)=>b.score-a.score||a.i-b.i);
 // Prefer distinct identity concepts when both singular/plural variants exist.
 const chosen=[],used=new Set();
 for(const item of scored){
  const normalized=item.label.toLowerCase().replace(/children of god/,'child of god').replace(/chosen ones/,'chosen');
  if(used.has(normalized))continue;
  chosen.push({name:item.label,ref:item.reference});used.add(normalized);
  if(chosen.length===4)break;
 }
 return chosen;
}
function prayerMatches(request){
 const lower=request.toLowerCase();
 const matched=prayerPatterns.map(t=>({...t,score:(lower.match(new RegExp(t.pattern.source,'gi'))||[]).length})).filter(t=>t.score>0).sort((a,b)=>b.score-a.score);
 const primary=matched[0]||{id:'general',title:'Bring Your Heart to God',refs:['Psalm 46:1','James 1:5','Philippians 4:6','Psalm 34:18'],prayer:'Give strength for the concerns expressed here, wisdom for each next step, and hope in Your faithfulness.'};
 const secondary=matched.find(t=>t.id!==primary.id);
 const terms=[...new Set((lower.match(/[a-z]{4,}/g)||[]).filter(w=>!prayerStopWords.has(w)))];
 const indexed=[...verses.map(v=>({reference:v.reference,summary:v.summary||'',theme:v.theme||''})),...studyData.R.map(v=>({reference:v.reference,summary:v.note||'',theme:v.section||''}))];
 const scored=indexed.map(v=>({...v,score:terms.reduce((n,w)=>n+((v.summary+' '+v.theme).toLowerCase().includes(w)?1:0),0)})).filter(v=>v.score>=2).sort((a,b)=>b.score-a.score);
 const refs=[...new Set([primary.refs[0],...(secondary?[secondary.refs[0]]:[]),...primary.refs.slice(1),...scored.slice(0,2).map(v=>v.reference)])].slice(0,4);
 const names=prayerFourNames(request,matched);
 const fragments=matched.slice(0,3).map(t=>t.prayer);
 return {title:primary.title,refs,names,prayer:fragments.join(' '),topic:primary.id,secondary:secondary?.id||'',request};
}
function prayerReply(entry){
 const names=(entry.names||[]).map(n=>typeof n==='string'?{name:n,ref:''}:n);
 const nameText=names.map(n=>esc(n.name)).join(', ');
 const topicText={family:'family and relationships',future:'the future and choices ahead',work:'work and financial needs',health:'health and healing',grief:'grief and loss',fear:'fear and anxiety',lonely:'loneliness and belonging',forgiveness:'forgiveness and renewal',purpose:'purpose and identity',general:'the concerns shared'};
 const subject=topicText[entry.topic]||'the concerns shared';
 const secondary=entry.secondary&&topicText[entry.secondary]?', as well as '+topicText[entry.secondary]:'';
 const identityPhrase=names.length?'Thank You for calling Your people '+names.map(n=>n.name).join(', ')+'. ':'';
 const spiritPhrase=names.some(n=>/friend|beloved|loved one/i.test(n.name))?'Holy Spirit, increase the awareness of Your presence in their life; let them know Your friendship and know themselves as beloved. ': 'Holy Spirit, make Your presence known and guide them into Your truth. ';
 const mercyPhrase=entry.topic==='forgiveness'||entry.secondary==='forgiveness'?'Through the blood of Jesus, remind them of the mercy and forgiveness You offer. Let Your kindness bring restoration and Your grace bring beauty. ':'Through Jesus Christ, let Your mercy and kindness bring hope, and Your grace bring beauty even in difficult circumstances. ';
 const prayer='Father, we bring '+subject+secondary+' before You. '+identityPhrase+esc(entry.prayer||'Give wisdom, courage, and hope for the next step.');
 return `<div class="prayer-reply"><span class="eyebrow dark">YOUR RIGHT-PRAYER WORD</span><h3>${esc(entry.title)}</h3><p>As you bring ${esc(subject)} before God, these passages offer a place to find strength, courage, and hope. Read them in context and take time to reflect on what they say.</p><h4>Scripture for your prayer</h4><div class="prayer-scriptures">${entry.refs.map(ref=>`<div class="prayer-scripture"><strong>${esc(ref)}</strong> ${passageLink(ref)} <span class="bible-prayer-verse" data-bible-ref="${esc(ref)}"></span></div>`).join('')}</div><h4>Names God calls His people</h4><p>Explore these names from the Your Name research and their biblical context:</p><div class="prayer-name-chips">${names.map(n=>n.ref?`<button type="button" class="prayer-name-chip" data-name-ref="${esc(n.ref.split(/\s*&\s*/)[0])}" title="Read ${esc(n.ref)}">${esc(n.name)} <small>${esc(n.ref)}</small></button>`:`<span class="prayer-name-chip">${esc(n.name)}</span>`).join('')}</div><p><strong>God calls you:</strong> ${nameText} <strong>(and much more!)</strong></p><button class="subtle" data-go-names>Explore Your Name →</button><h4>A prayer for you</h4><p>${esc(prayer+' '+spiritPhrase+mercyPhrase+'Give them strength, courage, and hope as they seek You. In Jesus\' name, amen.')}</p><p>Thank you for sharing your prayer. For follow-up, contact <a href="mailto:prayerformvolunteer@gmail.com">prayerformvolunteer@gmail.com</a>.</p></div>`;
}
function renderPrayer(){
 const entries=prayerEntries();
 $('#content').innerHTML=`<section class="section-heading"><span class="eyebrow dark">SCRIPTURE · ENCOURAGEMENT · PRAYER</span><h2>Ask for a Right-Prayer Word</h2><p>Write your prayer request below, and receive a prayer-word with Scripture right now.</p></section><section class="prayer-form"><h3>What's on your heart?</h3><p>Private by default. Requests are only in this browser on this device.</p><label for="prayer-request">Your prayer request</label><textarea id="prayer-request" maxlength="1500" rows="5" placeholder="What would you like prayer and Scripture-based encouragement about?"></textarea><div class="prayer-privacy"><label><input type="radio" name="prayer-visibility" checked> Keep private on this device</label><label class="prayer-unavailable"><input type="radio" name="prayer-visibility" disabled> Share anonymously with the community — coming after secure storage and moderation are ready</label></div><button id="prayer-submit" class="gold-btn">Find My Right-Prayer Word ↗</button><p id="prayer-error" role="alert"></p></section><section class="prayer-history"><h3>Your private prayer journal</h3><p class="disclaimer">Only stored in this browser. Clearing browser data deletes this journal. It is not synced, password-protected, or visible to the community.</p>${entries.length?entries.map((e,i)=>`<article class="prayer-thread"><div class="prayer-request"><strong>Your prayer request</strong><p>${esc(e.request)}</p></div>${prayerReply(e)}<button class="subtle" data-delete-prayer="${i}">Delete this prayer and response</button></article>`).join(''):'<p>No prayers saved on this device yet.</p>'}</section><section class="prayer-community"><span class="eyebrow dark">COMMUNITY · COMING LATER</span><h3>Anonymous Prayer Community</h3><p>When secure storage, privacy review, and moderation are ready, you will be able to choose whether to share an approved prayer and its Scripture response. Nothing in your private journal is published automatically.</p></section>`;
 $('#prayer-submit').onclick=async()=>{const input=$('#prayer-request'),request=input.value.trim();if(request.length<10){$('#prayer-error').textContent='Please write at least 10 characters about your prayer request.';return}const m=prayerMatches(request);const entries=prayerEntries();entries.unshift({request,title:m.title,refs:m.refs,names:m.names,prayer:m.prayer,topic:m.topic,secondary:m.secondary});try{persist(prayerStore,entries.slice(0,40));renderPrayer();$('.prayer-history').scrollIntoView({behavior:'smooth'})}catch(e){$('#prayer-error').textContent='This browser could not save the request. Please check available device storage.'}};
 document.querySelectorAll('[data-delete-prayer]').forEach(b=>b.onclick=()=>{if(!confirm('Delete this prayer and response from this device?'))return;const list=prayerEntries();list.splice(Number(b.dataset.deletePrayer),1);persist(prayerStore,list);renderPrayer()});
 document.querySelectorAll('[data-bible-ref]').forEach(async el=>{try{const text=await getBibleVerse(el.dataset.bibleRef,'bsb');if(text)el.textContent=' — '+text}catch(e){}});document.querySelectorAll('[data-name-ref]').forEach(b=>b.onclick=()=>{const ref=b.dataset.nameRef;const url='https://www.biblegateway.com/passage/?search='+encodeURIComponent(ref)+'&version=BSB';window.open(url,'_blank','noopener,noreferrer')});document.querySelectorAll('[data-go-names]').forEach(b=>b.onclick=()=>{tab='names';render();$('.tabs').scrollIntoView({behavior:'smooth'})});
}

function renderSaved(){let saved=favorites.map(find).filter(Boolean);$('#content').innerHTML=`<section class="section-heading"><span class="eyebrow dark">PERSONAL LIBRARY</span><h2>Saved Scripture</h2><p>Your favorites are saved locally on this device.</p></section><div class="cards">${saved.length?saved.map(card).join(''):'<div class="empty">Tap ☆ Save on a verse to build your personal Scripture collection.</div>'}</div>`}
function renderAbout(){$('#content').innerHTML=`<section class="section-heading"><span class="eyebrow dark">OUR PURPOSE</span><h2>About RightLens</h2><p>See life through the lens of righteousness.</p></section><article class="about"><h3>Scripture first. Always.</h3><p>RightLens is designed to help readers explore what Scripture says about the righteous, what God does for them, the fruit of righteousness, and identity in Christ. </article>`}
function bindActions(){document.querySelectorAll('[data-save]').forEach(b=>b.onclick=()=>{const ref=b.dataset.save;favorites=favorites.includes(ref)?favorites.filter(x=>x!==ref):[...favorites,ref];persist('rl-favorites',favorites);render();if(selected)showDetail(selected)});document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>showDetail(b.dataset.open))}
function showDetail(ref){const v=find(ref);if(!v){alert('Reference not included in the curated index yet: '+ref);return}selected=ref;$('#detail').innerHTML=`<div class="modal-overlay" id="overlay"><section class="detail" role="dialog" aria-modal="true" aria-label="Study ${esc(ref)}"><button class="close" id="close">✕</button><span class="eyebrow dark">SCRIPTURE STUDY</span><h2>${esc(v.reference)}</h2><span class="category">${esc(cats[v.category])}</span><p class="detail-summary">${esc(v.summary)}</p><p>${passageLink(v.reference)}</p><h3>Theological Breakdown</h3><div class="detail-block"><strong>Theme</strong><p>${esc(v.theme)}</p></div><div class="detail-block"><strong>Context & interpretation</strong><p>${v.reviewed?esc(v.summary):'This reference is indexed for further review. Open the full passage in a licensed Bible and study its original context before drawing a doctrinal conclusion.'}</p></div><div class="detail-block"><strong>Application</strong><p>Consider how the passage directs faith and conduct in its literary and historical setting. Avoid turning wisdom poetry into an unconditional promise.</p></div><h3>Connected passages</h3><div class="links">${v.crossReferences.length?v.crossReferences.map(r=>`<button class="chip" data-linked="${esc(r)}">${esc(r)} ↗</button>`).join(''):'<p>Additional cross-references can be added to this passage.</p>'}</div><p class="disclaimer">This is an original study summary, not the ESV verse text.</p></section></div>`;$('#close').onclick=closeDetail;$('#overlay').onclick=e=>{if(e.target.id==='overlay')closeDetail()};document.querySelectorAll('[data-linked]').forEach(b=>b.onclick=()=>showDetail(b.dataset.linked))}
function closeDetail(){selected=null;$('#detail').innerHTML=''}
function installBanner(){const standalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone;const ios=/iPad|iPhone|iPod/.test(navigator.userAgent);if(!ios||standalone||sessionStorage.getItem('rl-hide-install'))return;$('#install').innerHTML='<div class="install"><span>📱 Install RightLens: Safari → Share → Add to Home Screen</span><button aria-label="Dismiss install help">✕</button></div>';$('#install button').onclick=()=>{sessionStorage.setItem('rl-hide-install','1');$('#install').innerHTML=''}}
fetch('/verses.json').then(r=>{if(!r.ok)throw Error('Unable to load index');return r.json()}).then(async v=>{verses=v;const [r,n]=await Promise.all([fetch('/rvu.json').then(r=>r.ok?r.json():{R:[],U:[]}).catch(()=>({R:[],U:[]})),fetch('/names.json').then(r=>r.ok?r.json():[]).catch(()=>[])]);studyData=r;nameData=n;shell();if('serviceWorker'in navigator)navigator.serviceWorker.register('/sw.js').catch(()=>{})}).catch(e=>{$('#app').textContent='Unable to load RightLens. Please reconnect once to download the offline library.';console.error(e)});


// Full Bible: verse-by-verse BSB and KJV, self-hosted and loaded per book.
let bibleBooks=null;const bibleCache=new Map();let bibleVersion='bsb',bibleCompare=false,bibleTerm='',bibleResults=[];
async function bibleList(){if(!bibleBooks){const r=await fetch('/bible/books.json');if(!r.ok)throw Error('Bible book list unavailable');bibleBooks=await r.json()}return bibleBooks}
async function loadBibleBook(book,version){const k=version+'|'+book;if(bibleCache.has(k))return bibleCache.get(k);const r=await fetch('/bible/'+version+'-'+book.toLowerCase().replace(/ /g,'-')+'.json');if(!r.ok)throw Error('Bible book unavailable: '+book);const data=await r.json();bibleCache.set(k,data);return data}
async function getBibleVerse(ref,version='bsb'){const books=await bibleList();const b=books.find(x=>ref.startsWith(x+' '));if(!b)return '';const data=await loadBibleBook(b,version);return data[ref]||''}
async function searchFullBible(term,version='bsb',limit=100){const books=await bibleList();const terms=term.toLowerCase().split(/[^a-z0-9]+/).filter(x=>x.length>3&&!['please','would','could','have','with','from','this','that','about','there','their','what','when','where','need','prayer','pray','help'].includes(x));const phrase=term.trim().toLowerCase();let results=[];for(const book of books){const data=await loadBibleBook(book,version);for(const [ref,text] of Object.entries(data)){const t=text.toLowerCase();const hits=terms.reduce((n,w)=>n+(t.includes(w)?1:0),0);if(hits||t.includes(phrase)&&phrase){results.push({ref,text,score:hits+(t.includes(phrase)?4:0)})}}}results.sort((a,b)=>b.score-a.score);return results.slice(0,limit)}
async function renderBible(){const books=await bibleList();$('#content').innerHTML=`<section class="section-heading"><span class="eyebrow dark">66 BOOKS · TWO TRANSLATIONS</span><h2>Explore the Full Bible</h2><p>Search every verse of the Berean Standard Bible or King James Version. No Bible API or download required.</p></section><section class="search-panel"><label for="bible-q">Search Scripture or enter a reference</label><div class="searchline"><input id="bible-q" type="search" placeholder="peace, love, Genesis 1:1..." value="${esc(bibleTerm)}"><button id="bible-search" class="gold-btn">Search</button></div><div class="mode"><label for="bible-version">Translation </label><select id="bible-version"><option value="bsb" ${bibleVersion==='bsb'?'selected':''}>BSB — Berean Standard Bible</option><option value="kjv" ${bibleVersion==='kjv'?'selected':''}>KJV — King James Version</option></select><label><input type="checkbox" id="bible-compare" ${bibleCompare?'checked':''}> Compare BSB + KJV</label></div><p id="bible-status" aria-live="polite">${bibleResults.length?bibleResults.length+' results shown':'Enter a search to explore all 66 books.'}</p></section><div id="bible-results"></div>`;
$('#bible-version').onchange=e=>{bibleVersion=e.target.value};$('#bible-compare').onchange=e=>{bibleCompare=e.target.checked};$('#bible-q').onkeydown=e=>{if(e.key==='Enter')$('#bible-search').click()};$('#bible-search').onclick=async()=>{const term=$('#bible-q').value.trim();if(!term)return;bibleTerm=term;const status=$('#bible-status');status.textContent='Searching Scripture…';const btn=$('#bible-search');btn.disabled=true;try{const direct=/^(.+?)\s+(\d+):(\d+)$/.exec(term);if(direct&&books.includes(direct[1])){const ref=term;const text=await getBibleVerse(ref,bibleVersion);bibleResults=text?[{ref,text,score:1}]:[]}else bibleResults=await searchFullBible(term,bibleVersion,100);status.textContent=bibleResults.length+' results shown (up to 100; search again to refine)';await drawBibleResults()}catch(e){status.textContent='Could not load Bible text. Check your connection and retry.';console.error(e)}finally{btn.disabled=false}};
if(bibleResults.length)await drawBibleResults()}
async function drawBibleResults(){const node=$('#bible-results');if(!node)return;let html='';for(const item of bibleResults){const second=bibleCompare?await getBibleVerse(item.ref,bibleVersion==='bsb'?'kjv':'bsb'):null;html+=`<article class="bible-result"><h3>${esc(item.ref)}</h3><div class="bible-compare-grid"><div><strong>${bibleVersion.toUpperCase()}</strong><p>${esc(item.text)}</p></div>${second!==null?`<div><strong>${bibleVersion==='bsb'?'KJV':'BSB'}</strong><p>${esc(second)}</p></div>`:''}</div></article>`}node.innerHTML=html||'<p>No matching verses. Try another search.</p>'}


const removeActiveClass=()=>{
    const allLessonBtn=document.querySelectorAll('.lesson-btn');
    allLessonBtn.forEach(btn=>btn.classList.remove('active'));
}
const displaySynonyms=(synonyms)=>{
    const htmlElm=synonyms.map(synonym=>`<span class='btn'>${synonym}</span>`)
    return htmlElm.join(" ");
}

const manageSpinner=(status)=>{
    if(status==true){
        document.getElementById('spinner').classList.remove('hidden');
        document.getElementById('word-container').classList.add('hidden');
    }
    else{
        document.getElementById('word-container').classList.remove('hidden');
        document.getElementById('spinner').classList.add('hidden');
    }
}

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US"; // English
  window.speechSynthesis.speak(utterance);
}
const loadLesson=()=>{
    const url='https://openapi.programming-hero.com/api/levels/all';
    fetch(url)
    .then((res)=>res.json())
    .then((json)=>displayLesson(json.data));
}
const loadWord=(id)=>{
    manageSpinner(true)
    const url=`https://openapi.programming-hero.com/api/level/${id}`
    fetch(url)
    .then((res)=>res.json())
    .then((data)=>{
        removeActiveClass();
        const lessonBtn=document.getElementById(`lesson-btn-${id}`)
        lessonBtn.classList.add('active')
        displayLevelWord(data.data)});
}
const loadWordDetails=async(id)=>{
    const url=`https://openapi.programming-hero.com/api/word/${id}`;
    const res=await fetch(url)
    const details=await res.json();
    displayWordDetails(details.data);
}
const displayWordDetails=(word)=>{
    const detailsBox=document.getElementById('details-container');
    detailsBox.innerHTML=`
        <h2 class="text-xl font-bold">${word.word} (<i class="fa-solid fa-microphone-lines"></i> :${word.pronunciation})</h2>
        <div class="space-y-1">
            <h2 class="font-bold">Meaning</h2>
            <p class="font-bangla">${word.meaning}</p>
        </div>
        <div class="space-y-1">
            <h2 class="font-bold">Example</h2>
            <p>${word.sentence}</p>
        </div>
        <div class="space-y-1">
            <h2 class="font-bold font-bangla">সমার্থক শব্দ গুলো</h2>
            <div class="flex gap-1 flex-wrap">
                ${displaySynonyms(word.synonyms)}
            </div>
        </div>
    `
    document.getElementById('my_modal').showModal();
}
const displayLevelWord=(words)=>{
    
    const wordContainer=document.getElementById('word-container');
    wordContainer.innerHTML='';
    if(words.length==0){
        wordContainer.innerHTML=`
        <div class="col-span-full text-center py-5 space-y-4 font-bangla">
            <img class="mx-auto" src="./assets/alert-error.png">
            <p class="text-sm  text-gray-400">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h2 class="text-2xl font-bold ">নেক্সট Lesson এ যান</h2>
        </div>
        `
        manageSpinner(false);
        return;
    }
    words.forEach(word => {
        const wordCard=document.createElement('div');
        wordCard.innerHTML=`
        <div class="bg-white px-5 py-10 rounded-xl shadow-sm text-center space-y-4 h-full">
            <h2 class="text-2xl font-bold">${word.word?word.word:"ওয়ার্ড পাওয়া যায় নি"}</h2>
            <p class="font-semibold">Meaning /Pronunciation</p>
            <div class="text-2xl font-medium font-bangla">"${word.meaning?word.meaning:"অর্থ পাওয়া যায় নি"} / ${word.pronunciation?word.pronunciation:"Pronunciation পাওয়া যায় নি"}"</div>
            <div class="flex justify-between items-center">
                <button onclick="loadWordDetails(${word.id})" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-circle-info"></i></button>
                <button onclick="pronounceWord('${word.word}')" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-volume-high"></i></button>
            </div>
        </div>
        `  
        wordContainer.appendChild(wordCard);      
    });
    manageSpinner(false);
}
const displayLesson=(lessons)=>{
    const lessonContainer=document.getElementById('lesson-container');
    lessonContainer.innerHTML="";

    //get into every lessons
    for(let lesson of lessons){
        const btnDiv=document.createElement('div');
        btnDiv.innerHTML=`
        <button id="lesson-btn-${lesson.level_no}" onclick="loadWord(${lesson.level_no})" class="lesson-btn btn btn-outline btn-primary"><i class="fa-solid fa-book-open"></i> Lesson- ${lesson.level_no}</button>
        `;
        lessonContainer.appendChild(btnDiv);
    }
    const btnDiv=document.createElement('div');
}


loadLesson()
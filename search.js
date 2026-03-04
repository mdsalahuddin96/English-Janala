document.getElementById('search-btn').addEventListener('click',()=>{
    removeActiveClass()
    const inputValue=document.getElementById('search-input').value;
    const url='https://openapi.programming-hero.com/api/words/all';
    fetch(url)
    .then(res=>res.json())
    .then(data=>findWord(data.data,inputValue));
})

const findWord=(words,inputValue)=>{
    const cleanInputValue=inputValue.trim().toLowerCase();
    const filteredWord=words.filter(word=>word.word.toLowerCase().includes(cleanInputValue))
    displayLevelWord(filteredWord);
}
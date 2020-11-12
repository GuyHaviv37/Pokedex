//import './sass/main.scss';
import {pokeTrie} from './Trie';
import {onInputSelect} from './render';
import {debounce,idInRange} from './utils';


String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

/*
    EVENT LISTENERS FOR SEARCH
*/
const onInput = (e)=>{
    const dropdown = document.querySelector('.dropdown-menu');
    const input = document.querySelector('.search-box__input');
    input.setCustomValidity('');
    let inputStr = e.target.value.toLowerCase().trim();
    if(idInRange(inputStr)){ // if ID was searched
        dropdown.classList.remove('is-active');
        onInputSelect(inputStr);
        return;
    } else if (!isNaN(inputStr) && inputStr !== ''){
        dropdown.classList.remove('is-active');
        input.setCustomValidity("Invalid ID number");
        return;
    }
    if(inputStr === ''){
        dropdown.classList.remove('is-active');
        return;
    }
    const items = pokeTrie.find(`${inputStr.toLowerCase()}`);
    if(items.length === 0){
        dropdown.classList.remove('is-active');
        input.setCustomValidity("Invalid pokémon name");
        return;
    }
    dropdown.innerHTML = ''; //reset previous search
    dropdown.classList.add('is-active') // make menu visible
    for(let item of items){
        const li = document.createElement('li');
        li.classList.add('dropdown-item');
        //li.innerHTML = renderDropdownItem(item);
        li.innerHTML = `<a href="#section-results">${item.capitalize()}</a>`;
        li.addEventListener('click',(e)=>{
            dropdown.classList.remove('is-active');
            input.value = item.capitalize();
            if (item === "farfetch'd") item = 'farfetchd';
            onInputSelect(item);
        })
        dropdown.append(li);
    }
}


// GENERAL EVENT LISTENERS
const inputBox = document.querySelector('.search-box__input-box');
const clearBtn = document.querySelector('.search-box__clear-btn');
const dropdown = document.querySelector('.dropdown-menu');
document.addEventListener('click', e => {
    if (!inputBox.contains(e.target)) {
        dropdown.classList.remove('is-active');
    }
});

const input = document.querySelector('.search-box__input');
input.addEventListener('input',debounce(onInput,500));
input.addEventListener('focus', e => {
    // !idInRange is to prevent re-render on re-focusing on prev id search
    if(e.target.value !== '' && !idInRange(e.target.value)){
        onInput(e);
    }
});

clearBtn.addEventListener('click',()=>{
    input.value = '';
    dropdown.classList.remove('is-active');
})

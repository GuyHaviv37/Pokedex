import {fetchData , parseData} from './utils'
import {pokeTypes} from './pokemonTypes';

const DEFAULT_POKEMON_IMAGE = '/public/img/favicon.png'

// So far onInputSelect applies onl y for pokemon data (fetchData can support other categories)
export const onInputSelect = async (selection)=>{
    try{
        const spinner = document.querySelector('.spinner');
        //const category = document.querySelector('.search-box__select').selectedOptions[0].value //parse category via value
        const data = await fetchData('pokemon',selection);
        // add loader
        spinner.classList.remove('is-hidden');
        const parsedData = await parseData(data);
        renderPokemon('pokemon',parsedData);
        // remove loader
        spinner.classList.add('is-hidden');
    } catch (err) {
        console.log(err);
    }

}

export const renderPokemon = (category,parsedData)=>{
    // so far only category === pokemon
    try{
        const root = document.querySelector('.poke-box');
        const input = document.querySelector('.search-box__input');
        root.classList.remove('is-hidden');
        root.innerHTML="";
        root.append(createArticle(parsedData));
        root.innerHTML += `<div class="poke-box__extras">
            <div class="poke-box__evo-box">
                <h3 class="heading-tertiary">Evolutions:</h3>
                <div class="poke-box__evo-list">
                </div>
                <p>Click on a card to search that pokémon</p>
            </div>
            <div class="poke-box__moves-box">
                <h3 class="heading-tertiary u-margin-bottom-medium">Moves:</h3>
                <ul class="poke-box__moves-list">
                </ul>
                <p>*Moves eligble via leveling up only</p>
            </div>
        </div>`
        createEvoCards(root,input,parsedData);
        createMoves(root,parsedData);
    } catch (err){
        console.log('ERROR RENDERING');
        console.log(err);
    }
    
}

const createArticle = (parsedData)=>{
    const article = document.createElement('article');
    article.classList.add('poke-box__dashboard');
    const imageBox = createImage(parsedData.id);
    article.append(imageBox);
    const header = createHeader(parsedData);
    article.append(header);
    const baseStats = createBaseStats(parsedData);
    article.append(baseStats);
    return article;
}

const createImage = (id)=>{
    const imageBox = document.createElement('div');
    imageBox.classList.add('poke-box__img-box');
    imageBox.innerHTML = `<img src="https://pokeres.bastionbot.org/images/pokemon/${id}.png" alt="pokemon Image~!"
    onError="this.onerror=null;src='${DEFAULT_POKEMON_IMAGE}';">`
    return imageBox;
}

const createHeader = (parsedData)=>{
    const header = document.createElement('div');
    header.classList.add('poke-box__header');
    header.innerHTML = `<span class="heading-sub">#${parsedData.id}</span> <h2 class="heading-secondary"> ${parsedData.name}</h2>
    <h4 class="heading-sub">Types : ${parsedData.typesStr}  </h4>
    <h4 class="heading-sub">First Apperance : ${parsedData.genStr}</h4>`
    return header;
}

const createBaseStats = (parsedData)=>{
    const baseStats = document.createElement('div');
    baseStats.classList.add('poke-box__base-stats');
    baseStats.innerHTML = `<h3 class="heading-tertiary u-margin-bottom-small">Base Stats:</h3>
    <ul>
        <li>HP: ${parsedData.stats[0].base_stat}</li>
        <li>Attack: ${parsedData.stats[1].base_stat}</li>
        <li>Defense: ${parsedData.stats[2].base_stat}</li>
        <li>Special Attack: ${parsedData.stats[3].base_stat}</li>
        <li>Special Defense: ${parsedData.stats[4].base_stat}</li>
        <li>Speed: ${parsedData.stats[5].base_stat}</li>
        <li>Height: ${parsedData.height}</li>
        <li>Weight: ${parsedData.weight}</li>
    </ul>`;
    return baseStats;
}

const createEvoCards = (root,input,parsedData)=>{
    const evoList = root.querySelector('.poke-box__evo-list');
    for(let evo of parsedData.evosArray){
        let evoCard = document.createElement('article');
        evoCard.classList.add('evo-card');
        evoCard.dataset.id = evo.id;
        evoCard.innerHTML = `
        <header class="evo-card__evo-header">
            <p class="evo-id" data-id="${evo.id}">#${evo.id}</p>
            <h4 class="evo-card__evo-title" data-id="${evo.id}">${evo.name}</h4>
        </header>
        <div class="evo-card__img-box">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.id}.png" alt="pokemon Image" data-id="${evo.id}">
        </div>
        <footer class="evo-card__details data-id="${evo.id}">
        <p>${evo.details ? evo.details : ''}</p>
        </footer>
        `;
        evoCard.addEventListener('click',(e)=>{
            input.value = e.target.dataset.id;
            onInputSelect(e.target.dataset.id);
        })
        evoList.append(evoCard);
    }
}

const createMoves = (root,parsedData)=>{
    const movesList = document.querySelector('.poke-box__moves-list');
    for(let move of parsedData.movesArray){
        const li = document.createElement('li');
        li.classList.add('poke-box__moves-item');
        li.innerHTML =
         `${pokeTypes[move.type]} ${move.name.capitalize()} PWR:${move.power || '-'} PP:${move.power || '-'} \n
         &nbsp; ${move.level_learned_at <= 1   ? '(BASE)' : `(LVL${move.level_learned_at})`}`;
        movesList.append(li);
    }
}



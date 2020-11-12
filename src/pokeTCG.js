const pokemon = require('pokemontcgsdk');

const searchCharizard = (str)=>{
    pokemon.card.all({name:'charizard'})
    .on('data',result => {
        console.log(result) // "Charizard"
    })
}

const tcgBtn = document.querySelector('#tcgBtn');
tcgBtn.addEventListener('click',searchCharizard);

// searchCharizard();


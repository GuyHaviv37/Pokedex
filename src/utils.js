import {pokeTypes,pokeMap} from './pokemonTypes';

export const debounce = (func,delay=500)=>{
    let timeoutId;
    return (...args)=>{
        if(timeoutId){
            clearTimeout(timeoutId)
        }
        timeoutId = setTimeout(()=>{
            func.apply(null,args);
        },delay)   
    }
}

export const fetchData = async (category,searchTerm) => {
    try{
        if(searchTerm in pokeMap){
            searchTerm = pokeMap[searchTerm];
        }
        const response = await axios.get(`https://pokeapi.co/api/v2/${category}/${searchTerm}/`);
        return response.data;
    } catch{
        console.log('Error fetching data from pokeAPI');
    }
}

const getGenStr = (data)=>{
    const versions = data.sprites.versions
    const keys = Object.keys(versions);
    for(let key of keys){
        let gen = versions[key];
        for(let game of Object.keys(gen)){
            if (gen[game].front_default){
                return key;
            } 
        }
    }
}

const getChainDetails = (evoStep)=>{
    let result = [];
    for(let details of evoStep.evolution_details){
        const trigger = details.trigger.name;
        if(trigger === 'level-up'){
            if(details.min_level){
                result.push(`@ LVL${details.min_level}`);
            }
            if(details.min_happiness){
                result.push(`@ ${details.min_happiness} happiness`);
            }
            if(details.min_beauty){
                result.push(`@ ${details.min_beauty} beauty`);
            }
            if(details.min_affection){
                result.push(`@ ${details.min_affection} affection`);
            }
            if(details.time_of_day){
                result.push(`at ${details.time_of_day}`);
            }
            if(details.relative_physical_stats !== null){
                switch(details.relative_physical_stats){
                    case 1: result.push('w/ attack > defence');
                    break;
                    case -1: result.push('w/ attack < defence');
                    break;
                    default: result.push('w/ attack = defence');
                }
            }
            if(details.needs_overworld_rain){
                result.push('overworld rain');
            }
            if(details.party_species){
                result.push(`@ party with ${details.party_species.name}`)
            }
            if(details.turn_upside_down){
                result.push('w/ turn device upside-down')
            }
            if(details.location){
                result.push(`${details.location.name}`)
            }
        }
        if(trigger === 'use-item' && details.item){
            result.push(`w/ ${details.item.name.toUpperCase()}`);
        }
        if(trigger === 'trade'){
            let tradeStr = "by trade ";
            if(details.trade_species){
                tradeStr +=`for ${details.trade_species.name}`
            }
            if(details.held_item){
                tradeStr +=`holding ${details.held_item.name}`
            }
            result.push(tradeStr);
        }
        if(trigger === 'shed'){
            result.push('by shedding');
        }
    }
    if(evoStep.evolution_details[0].location){
        return "On locations: " + result.join(", ");
    }
    return "Evolves " + result.join(", ");
}

const recEvoChain = (arr,evoChain)=>{
    if (evoChain.evolves_to.length === 0){
        return;
    } //else
    evoChain.evolves_to.forEach(chain => {
        let url = chain.species.url.split("/")
        arr.push({
            name : chain.species.name,
            id: url[url.length-2], //this will get the pokemon id
            details : getChainDetails(chain)
        });
        recEvoChain(arr,chain);
    })

}

const getEvos = async ({species})=>{
    try{
        const result = [];
        const pokeSpeciesURL = species.url;
        const pokeSpecies = await axios.get(pokeSpeciesURL);
        const evoChainData = await axios.get(pokeSpecies.data.evolution_chain.url);
        let evoChain = evoChainData.data.chain;
        let url = evoChain.species.url.split("/")
        result.push({
            name : evoChain.species.name,
            id: url[url.length-2] //this will get the pokemon id
        });
        recEvoChain(result,evoChain); // obtain all evolutions recursively
        return result;
    } catch (err){
        if(err instanceof TypeError)
            return [];
        else
            console.log(err);
    }

}

const getMoves = async ({moves})=>{
    const learntMoves = moves.filter( moveElement => {
        let method = moveElement.version_group_details[0].move_learn_method.name;
        return method === 'level-up';
    })
    learntMoves.sort((a,b)=>{
        return a.version_group_details[0].level_learned_at - b.version_group_details[0].level_learned_at;
    })
    const movesURL = learntMoves.map(moveElement => moveElement.move.url);
    const requests = movesURL.map( url => {
        return axios.get(url)
    })
    const movesDataRaw = await Promise.all(requests);
    return movesDataRaw.map( (moveDataRawEl,i) => {
        let moveData = moveDataRawEl.data;
        return {
            name: moveData.name,
            power : moveData.power,
            pp: moveData.pp,
            type : moveData.type.name,
            accuracy : moveData.accuracy,
            level_learned_at: learntMoves[i].version_group_details[0].level_learned_at
        }
    })
}

export const parseData = async (data)=>{
    try{
        // parse types string
        const typesArr = data.types.map( el =>{
            return `${el.type.name} ${pokeTypes[el.type.name]}`
        });
        const typesStr = typesArr.join(", ");
        // parse generation
        const genStr = getGenStr(data);

        // get evolution_chain data - parallel
        // get moves data
        const [evosArray,movesArray] = await Promise.all([getEvos(data),getMoves(data)]);

        return {
            ...data,
            typesStr,
            genStr,
            evosArray,
            movesArray
        }
    } catch (err){
        console.log(err);
    }
}

export const idInRange = (str)=>{
    return parseInt(str) >= 1 && parseInt(str) <=893;
}

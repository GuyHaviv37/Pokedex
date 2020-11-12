// Trie.js - super simple JS implementation
// https://en.wikipedia.org/wiki/Trie
// via https://gist.github.com/tpae/72e1c54471e88b689f85ad2b3940a8f0
// -----------------------------------------

// we start with the TrieNode
function TrieNode(key) {
    // the "key" value will be the character in sequence
    this.key = key;

    // we keep a reference to parent
    this.parent = null;

    // we have hash of children
    this.children = {};

    // check to see if the node is at the end
    this.end = false;
}

// iterates through the parents to get the word.
// time complexity: O(k), k = word length
TrieNode.prototype.getWord = function () {
    var output = [];
    var node = this;

    while (node !== null) {
        output.unshift(node.key);
        node = node.parent;
    }

    return output.join('');
};

// -----------------------------------------

// we implement Trie with just a simple root with null value.
function Trie() {
    this.root = new TrieNode(null);
}

// inserts a word into the trie.
// time complexity: O(k), k = word length
Trie.prototype.insert = function (word) {
    var node = this.root; // we start at the root 😬

    // for every character in the word
    for (var i = 0; i < word.length; i++) {
        // check to see if character node exists in children.
        if (!node.children[word[i]]) {
            // if it doesn't exist, we then create it.
            node.children[word[i]] = new TrieNode(word[i]);

            // we also assign the parent to the child node.
            node.children[word[i]].parent = node;
        }

        // proceed to the next depth in the trie.
        node = node.children[word[i]];

        // finally, we check to see if it's the last word.
        if (i == word.length - 1) {
            // if it is, we set the end flag to true.
            node.end = true;
        }
    }
};

// check if it contains a whole word.
// time complexity: O(k), k = word length
Trie.prototype.contains = function (word) {
    var node = this.root;

    // for every character in the word
    for (var i = 0; i < word.length; i++) {
        // check to see if character node exists in children.
        if (node.children[word[i]]) {
            // if it exists, proceed to the next depth of the trie.
            node = node.children[word[i]];
        } else {
            // doesn't exist, return false since it's not a valid word.
            return false;
        }
    }

    // we finished going through all the words, but is it a whole word?
    return node.end;
};

// returns every word with given prefix
// time complexity: O(p + n), p = prefix length, n = number of child paths
Trie.prototype.find = function (prefix) {
    var node = this.root;
    var output = [];

    // for every character in the prefix
    for (var i = 0; i < prefix.length; i++) {
        // make sure prefix actually has words
        if (node.children[prefix[i]]) {
            node = node.children[prefix[i]];
        } else {
            // there's none. just return it.
            return output;
        }
    }

    // recursively find all words in the node
    findAllWords(node, output);

    return output;
};

// recursive function to find all words in the given node.
function findAllWords(node, arr) {
    // base case, if node is at a word, push to output
    if (node.end) {
        arr.unshift(node.getWord());
    }

    // iterate through each children, call recursive findAllWords
    for (var child in node.children) {
        findAllWords(node.children[child], arr);
    }
}

const pokeNames = ["bulbasaur",
"ivysaur",
"venusaur",
"charmander",
"charmeleon",
"charizard",
"squirtle",
"wartortle",
"blastoise",
"caterpie",
"metapod",
"butterfree",
"weedle",
"kakuna",
"beedrill",
"pidgey",
"pidgeotto",
"pidgeot",
"rattata",
"raticate",
"spearow",
"fearow",
"ekans",
"arbok",
"pikachu",
"raichu",
"sandshrew",
"sandslash",
"nidoran female",
"nidorina",
"nidoqueen",
"nidoran male",
"nidorino",
"nidoking",
"clefairy",
"clefable",
"vulpix",
"ninetales",
"jigglypuff",
"wigglytuff",
"zubat",
"golbat",
"oddish",
"gloom",
"vileplume",
"paras",
"parasect",
"venonat",
"venomoth",
"diglett",
"dugtrio",
"meowth",
"persian",
"psyduck",
"golduck",
"mankey",
"primeape",
"growlithe",
"arcanine",
"poliwag",
"poliwhirl",
"poliwrath",
"abra",
"kadabra",
"alakazam",
"machop",
"machoke",
"machamp",
"bellsprout",
"weepinbell",
"victreebel",
"tentacool",
"tentacruel",
"geodude",
"graveler",
"golem",
"ponyta",
"rapidash",
"slowpoke",
"slowbro",
"magnemite",
"magneton",
"farfetch'd",
"doduo",
"dodrio",
"seel",
"dewgong",
"grimer",
"muk",
"shellder",
"cloyster",
"gastly",
"haunter",
"gengar",
"onix",
"drowzee",
"hypno",
"krabby",
"kingler",
"voltorb",
"electrode",
"exeggcute",
"exeggutor",
"cubone",
"marowak",
"hitmonlee",
"hitmonchan",
"lickitung",
"koffing",
"weezing",
"rhyhorn",
"rhydon",
"chansey",
"tangela",
"kangaskhan",
"horsea",
"seadra",
"goldeen",
"seaking",
"staryu",
"starmie",
"mr.mime",
"scyther",
"jynx",
"electabuzz",
"magmar",
"pinsir",
"tauros",
"magikarp",
"gyarados",
"lapras",
"ditto",
"eevee",
"vaporeon",
"jolteon",
"flareon",
"porygon",
"omanyte",
"omastar",
"kabuto",
"kabutops",
"aerodactyl",
"snorlax",
"articuno",
"zapdos",
"moltres",
"dratini",
"dragonair",
"dragonite",
"mewtwo",
"mew",
"chikorita",
"bayleef",
"meganium",
"cyndaquil",
"quilava",
"typhlosion",
"totodile",
"croconaw",
"feraligatr",
"sentret",
"furret",
"hoothoot",
"noctowl",
"ledyba",
"ledian",
"spinarak",
"ariados",
"crobat",
"chinchou",
"lanturn",
"pichu",
"cleffa",
"igglybuff",
"togepi",
"togetic",
"natu",
"xatu",
"mareep",
"flaaffy",
"ampharos",
"bellossom",
"marill",
"azumarill",
"sudowoodo",
"politoed",
"hoppip",
"skiploom",
"jumpluff",
"aipom",
"sunkern",
"sunflora",
"yanma",
"wooper",
"quagsire",
"espeon",
"umbreon",
"murkrow",
"slowking",
"misdreavus",
"unown",
"wobbuffet",
"girafarig",
"pineco",
"forretress",
"dunsparce",
"gligar",
"steelix",
"snubbull",
"granbull",
"qwilfish",
"scizor",
"shuckle",
"heracross",
"sneasel",
"teddiursa",
"ursaring",
"slugma",
"magcargo",
"swinub",
"piloswine",
"corsola",
"remoraid",
"octillery",
"delibird",
"mantine",
"skarmory",
"houndour",
"houndoom",
"kingdra",
"phanpy",
"donphan",
"porygon2",
"stantler",
"smeargle",
"tyrogue",
"hitmontop",
"smoochum",
"elekid",
"magby",
"miltank",
"blissey",
"raikou",
"entei",
"suicune",
"larvitar",
"pupitar",
"tyranitar",
"lugia",
"ho-oh",
"celebi",
"treecko",
"grovyle",
"sceptile",
"torchic",
"combusken",
"blaziken",
"mudkip",
"marshtomp",
"swampert",
"poochyena",
"mightyena",
"zigzagoon",
"linoone",
"wurmple",
"silcoon",
"beautifly",
"cascoon",
"dustox",
"lotad",
"lombre",
"ludicolo",
"seedot",
"nuzleaf",
"shiftry",
"taillow",
"swellow",
"wingull",
"pelipper",
"ralts",
"kirlia",
"gardevoir",
"surskit",
"masquerain",
"shroomish",
"breloom",
"slakoth",
"vigoroth",
"slaking",
"nincada",
"ninjask",
"shedinja",
"whismur",
"loudred",
"exploud",
"makuhita",
"hariyama",
"azurill",
"nosepass",
"skitty",
"delcatty",
"sableye",
"mawile",
"aron",
"lairon",
"aggron",
"meditite",
"medicham",
"electrike",
"manectric",
"plusle",
"minun",
"volbeat",
"illumise",
"roselia",
"gulpin",
"swalot",
"carvanha",
"sharpedo",
"wailmer",
"wailord",
"numel",
"camerupt",
"torkoal",
"spoink",
"grumpig",
"spinda",
"trapinch",
"vibrava",
"flygon",
"cacnea",
"cacturne",
"swablu",
"altaria",
"zangoose",
"seviper",
"lunatone",
"solrock",
"barboach",
"whiscash",
"corphish",
"crawdaunt",
"baltoy",
"claydol",
"lileep",
"cradily",
"anorith",
"armaldo",
"feebas",
"milotic",
"castform",
"kecleon",
"shuppet",
"banette",
"duskull",
"dusclops",
"tropius",
"chimecho",
"absol",
"wynaut",
"snorunt",
"glalie",
"spheal",
"sealeo",
"walrein",
"clamperl",
"huntail",
"gorebyss",
"relicanth",
"luvdisc",
"bagon",
"shelgon",
"salamence",
"beldum",
"metang",
"metagross",
"regirock",
"regice",
"registeel",
"latias",
"latios",
"kyogre",
"groudon",
"rayquaza",
"jirachi",
"deoxys",
"turtwig",
"grotle",
"torterra",
"chimchar",
"monferno",
"infernape",
"piplup",
"prinplup",
"empoleon",
"starly",
"staravia",
"staraptor",
"bidoof",
"bibarel",
"kricketot",
"kricketune",
"shinx",
"luxio",
"luxray",
"budew",
"roserade",
"cranidos",
"rampardos",
"shieldon",
"bastiodon",
"burmy",
"wormadam",
"mothim",
"combee",
"vespiquen",
"pachirisu",
"buizel",
"floatzel",
"cherubi",
"cherrim",
"shellos",
"gastrodon",
"ambipom",
"drifloon",
"drifblim",
"buneary",
"lopunny",
"mismagius",
"honchkrow",
"glameow",
"purugly",
"chingling",
"stunky",
"skuntank",
"bronzor",
"bronzong",
"bonsly",
"mimejr.",
"happiny",
"chatot",
"spiritomb",
"gible",
"gabite",
"garchomp",
"munchlax",
"riolu",
"lucario",
"hippopotas",
"hippowdon",
"skorupi",
"drapion",
"croagunk",
"toxicroak",
"carnivine",
"finneon",
"lumineon",
"mantyke",
"snover",
"abomasnow",
"weavile",
"magnezone",
"lickilicky",
"rhyperior",
"tangrowth",
"electivire",
"magmortar",
"togekiss",
"yanmega",
"leafeon",
"glaceon",
"gliscor",
"mamoswine",
"porygon-z",
"gallade",
"probopass",
"dusknoir",
"froslass",
"rotom",
"uxie",
"mesprit",
"azelf",
"dialga",
"palkia",
"heatran",
"regigigas",
"giratina",
"cresselia",
"phione",
"manaphy",
"darkrai",
"shaymin",
"arceus",
"victini",
"snivy",
"servine",
"serperior",
"tepig",
"pignite",
"emboar",
"oshawott",
"dewott",
"samurott",
"patrat",
"watchog",
"lillipup",
"herdier",
"stoutland",
"purrloin",
"liepard",
"pansage",
"simisage",
"pansear",
"simisear",
"panpour",
"simipour",
"munna",
"musharna",
"pidove",
"tranquill",
"unfezant",
"blitzle",
"zebstrika",
"roggenrola",
"boldore",
"gigalith",
"woobat",
"swoobat",
"drilbur",
"excadrill",
"audino",
"timburr",
"gurdurr",
"conkeldurr",
"tympole",
"palpitoad",
"seismitoad",
"throh",
"sawk",
"sewaddle",
"swadloon",
"leavanny",
"venipede",
"whirlipede",
"scolipede",
"cottonee",
"whimsicott",
"petilil",
"lilligant",
"basculin",
"sandile",
"krokorok",
"krookodile",
"darumaka",
"darmanitan",
"maractus",
"dwebble",
"crustle",
"scraggy",
"scrafty",
"sigilyph",
"yamask",
"cofagrigus",
"tirtouga",
"carracosta",
"archen",
"archeops",
"trubbish",
"garbodor",
"zorua",
"zoroark",
"minccino",
"cinccino",
"gothita",
"gothorita",
"gothitelle",
"solosis",
"duosion",
"reuniclus",
"ducklett",
"swanna",
"vanillite",
"vanillish",
"vanilluxe",
"deerling",
"sawsbuck",
"emolga",
"karrablast",
"escavalier",
"foongus",
"amoonguss",
"frillish",
"jellicent",
"alomomola",
"joltik",
"galvantula",
"ferroseed",
"ferrothorn",
"klink",
"klang",
"klinklang",
"tynamo",
"eelektrik",
"eelektross",
"elgyem",
"beheeyem",
"litwick",
"lampent",
"chandelure",
"axew",
"fraxure",
"haxorus",
"cubchoo",
"beartic",
"cryogonal",
"shelmet",
"accelgor",
"stunfisk",
"mienfoo",
"mienshao",
"druddigon",
"golett",
"golurk",
"pawniard",
"bisharp",
"bouffalant",
"rufflet",
"braviary",
"vullaby",
"mandibuzz",
"heatmor",
"durant",
"deino",
"zweilous",
"hydreigon",
"larvesta",
"volcarona",
"cobalion",
"terrakion",
"virizion",
"tornadus",
"thundurus",
"reshiram",
"zekrom",
"landorus",
"kyurem",
"keldeo",
"meloetta",
"genesect",
"chespin",
"quilladin",
"chesnaught",
"fennekin",
"braixen",
"delphox",
"froakie",
"frogadier",
"greninja",
"bunnelby",
"diggersby",
"fletchling",
"fletchinder",
"talonflame",
"scatterbug",
"spewpa",
"vivillon",
"litleo",
"pyroar",
"flabebe",
"floette",
"florges",
"skiddo",
"gogoat",
"pancham",
"pangoro",
"furfrou",
"espurr",
"meowstic",
"honedge",
"doublade",
"aegislash",
"spritzee",
"aromatisse",
"swirlix",
"slurpuff",
"inkay",
"malamar",
"binacle",
"barbaracle",
"skrelp",
"dragalge",
"clauncher",
"clawitzer",
"helioptile",
"heliolisk",
"tyrunt",
"tyrantrum",
"amaura",
"aurorus",
"sylveon",
"hawlucha",
"dedenne",
"carbink",
"goomy",
"sliggoo",
"goodra",
"klefki",
"phantump",
"trevenant",
"pumpkaboo",
"gourgeist",
"bergmite",
"avalugg",
"noibat",
"noivern",
"xerneas",
"yveltal",
"zygarde",
"diancie",
"hoopa",
"volcanion",
"rowlet",
"dartrix",
"decidueye",
"litten",
"torracat",
"incineroar",
"popplio",
"brionne",
"primarina",
"pikipek",
"trumbeak",
"toucannon",
"yungoos",
"gumshoos",
"grubbin",
"charjabug",
"vikavolt",
"crabrawler",
"crabominable",
"oricorio-baile",   
"cutiefly",
"ribombee",
"rockruff",
"lycanroc",
"wishiwashi",
"mareanie",
"toxapex",
"mudbray",
"mudsdale",
"dewpider",
"araquanid",
"fomantis",
"lurantis",
"morelull",
"shiinotic",
"salandit",
"salazzle",
"stufful",
"bewear",
"bounsweet",
"steenee",
"tsareena",
"comfey",
"oranguru",
"passimian",
"wimpod",
"golisopod",
"sandygast",
"palossand",
"pyukumuku",
"type:null",
"silvally",
"minior",
"komala",
"turtonator",
"togedemaru",
"mimikyu",
"bruxish",
"drampa",
"dhelmise",
"jangmo-o",
"hakamo-o",
"kommo-o",
"tapu koko",
"tapu lele",
"tapu bulu",
"tapu fini",
"cosmog",
"cosmoem",
"solgaleo",
"lunala",
"nihilego",
"buzzwole",
"pheromosa",
"xurkitree",
"celesteela",
"kartana",
"guzzlord",
"necrozma",
"magearna",
"marshadow",
"poipole",
"naganadel",
"stakataka",
"blacephalon",
"zeraora",
"meltan",
"melmetal",
"grookey",
"thwackey",
"rillaboom",
"scorbunny",
"raboot",
"cinderace",
"sobble",
"drizzile",
"inteleon",
"skwovet",
"greedent",
"rookidee",
"corvisquire",
"corviknight",
"blipbug",
"dottler",
"orbeetle",
"nickit",
"thievul",
"gossifleur",
"eldegoss",
"wooloo",
"dubwool",
"chewtle",
"drednaw",
"yamper",
"boltund",
"rolycoly",
"carkol",
"coalossal",
"applin",
"flapple",
"appletun",
"silicobra",
"sandaconda",
"cramorant",
"arrokuda",
"barraskewda",
"toxel",
"toxtricity",
"sizzlipede",
"centiskorch",
"clobbopus",
"grapploct",
"sinistea",
"polteageist",
"hatenna",
"hattrem",
"hatterene",
"impidimp",
"morgrem",
"grimmsnarl",
"obstagoon",
"perrserker",
"cursola",
"sirfetch'd",
"mr.rime",
"runerigus",
"milcery",
"alcremie",
"falinks",
"pincurchin",
"snom",
"frosmoth",
"stonjourner",
"eiscue",
"indeedee",
"morpeko",
"cufant",
"copperajah",
"dracozolt",
"arctozolt",
"dracovish",
"arctovish",
"duraludon",
"dreepy",
"drakloak",
"dragapult",
"zacian",
"zamazenta",
"eternatus",
"kubfu",
"urshifu",
"zarude"]

const pokeTrie = new Trie();
for(let name of pokeNames){
    pokeTrie.insert(name);
}

module.exports = {
    pokeTrie,
    pokeNames
}
const moduleInfo = {
    name: "humblebundle",
    truename: "humblebundle",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usage = {
    name: "humblebundle",
    cmdName: "hb",
    aliases: ["humblebundle", "hb"],
    args: {min: 0, max: 5},
    description: "Get results from either the Humble Bundle Store, Charity, or current popular bundles",
    usage: "[command]",
    exampleUsage: "hb",
    runIn: ["dm", "text"],
    categories: "Test",
    permlvl: 0,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

/*
https://www.humblebundle.com/store/api/search?sort=alphabetical&filter=all&search=&request=2&page_size=20&page=0
https://www.humblebundle.com/store/api/search?sort=bestselling&filter=onsale&search=&request=23&page_size=20&page=0&genre%5B%5D=Indie&genre%5B%5D=Simulation&platform%5B%5D=windows&platform%5B%5D=android&drm%5B%5D=download&drm%5B%5D=steam
https://www.humblebundle.com/api/v1/charity/search?query=&category=&country=US&state=&page=0&page_size=14&request=100
'SEARCH_PARAM_ORDER': ["filter", "genre", "platform", "drm", "search", "sort", "page", "developer", "publisher"],
'SEARCH_PARAMS': {"filter": {"onsale": "On Sale", "new": "New Releases"}, "genre": {"RPG": "RPG", "Virtual Reality": "Virtual Reality", "Indie": "Indie", "Sports": "Sports", "Massively Multiplayer": "Massively Multiplayer", "Multiplayer": "Multiplayer", "Simulation": "Simulation", "Stealth": "Stealth", "Strategy": "Strategy", "Adventure": "Adventure", "FPS": "FPS", "Action": "Action", "Tabletop": "Tabletop", "Software": "Software", "Racing": "Racing", "Puzzle": "Puzzle", "Retro": "Retro"}, "drm": {"download": "DRM-Free", "uplay": "Uplay", "steam": "Steam"}, "sort": {"discount": "Top Discounts", "alphabetical": "Alphabetical", "newest": "Release Date", "bestselling": "Bestselling"}, "platform": {"windows": "Windows", "mac": "Mac", "android": "Android", "linux": "Linux"}},

'CHARITY_SEARCH_PARAM_ORDER': ["query", "category", "country", "state", "page"],
'CHARITY_SEARCH_PARAMS': {"category": {"Health and Medicine": "Health and Medicine", "Employment and Professional Associations": "Employment and Professional Associations", "Arts and Culture": "Arts and Culture", "Animals": "Animals", "Schools and Education": "Schools and Education", "Science and Research": "Science and Research", "Sports and Recreation": "Sports and Recreation", "Society and Communities": "Society and Communities", "Religion and Spirituality": "Religion and Spirituality", "Environment": "Environment", "Human Services": "Human Services", "Children and Youth Development": "Children and Youth Development", "Philanthropy, Grants and Other": "Philanthropy, Grants and Other", "International": "International", "Crime Prevention and Justice": "Crime Prevention and Justice", "Military and Veterans": "Military and Veterans", "Housing, Homelessness and Hunger": "Housing, Homelessness and Hunger", "Disaster Relief": "Disaster Relief"}, "country": {"GB": "United Kingdom", "US": "United States"}, "state": {"WA": "Washington", "WI": "Wisconsin", "WV": "West Virginia", "FL": "Florida", "WY": "Wyoming", "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "NC": "North Carolina", "ND": "North Dakota", "NE": "Nebraska", "NY": "New York", "RI": "Rhode Island", "NV": "Nevada", "CO": "Colorado", "CA": "California", "GA": "Georgia", "CT": "Connecticut", "OK": "Oklahoma", "OH": "Ohio", "KS": "Kansas", "SC": "South Carolina", "KY": "Kentucky", "OR": "Oregon", "SD": "South Dakota", "DE": "Delaware", "DC": "District of Columbia", "HI": "Hawaii", "TX": "Texas", "LA": "Louisiana", "TN": "Tennessee", "PA": "Pennsylvania", "VA": "Virginia", "AK": "Alaska", "AL": "Alabama", "AR": "Arkansas", "VT": "Vermont", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa", "AZ": "Arizona", "ID": "Idaho", "ME": "Maine", "MD": "Maryland", "MA": "Massachusetts", "UT": "Utah", "MO": "Missouri", "MN": "Minnesota", "MI": "Michigan", "MT": "Montana", "MS": "Mississippi"}},
https://www.humblebundle.com/api/v1/charity/search?query=&category=&country=US&state=AL&page=0&page_size=14&request=10
*/

this.setupCommands = function(file) {
    this.file = file;
    return new Promise((resolve, reject) => {
        return resolve({file: this.file, moduleInfo: moduleInfo, commands: this.commands});
    });
}

blockText = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        return resolve({response: "Testing", silent: true});
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: blockText}
];

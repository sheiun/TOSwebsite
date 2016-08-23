

// =================================================================
// =================================================================
// =================================================================
// =================================================================

var RANDOM = new Date().getTime();
function randomNext(){    
    var rand = Math.sin(RANDOM++) * 10000;
    return rand - Math.floor(rand);
}
function randomBySeed(seed){    
    var rand = Math.sin(seed) * 10000;
    return rand - Math.floor(rand);
}


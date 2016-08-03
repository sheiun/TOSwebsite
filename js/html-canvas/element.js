
//==============================================================
// make element
//==============================================================
function initialTable(){
}

function initialColor(){
    for(var i = 0; i < TD_NUM; i++){
        for(var j = 0; j < TR_NUM; j++){
            itemData = newElementByID( j*TD_NUM+i );
            itemData['TD_INDEX'] = i;
            itemData['TR_INDEX'] = j;

            $('#BaseCanvas').addLayer({
                name: i+"_"+j,
                data: itemData,
                type: "image",
                source: itemData['src_path'],
                fromCenter: false,
                draggable: true,
                x: WIDTH*i, y: HEIGHT*j,
                width: WIDTH, height: HEIGHT,
                dragstart: function(layer, event){
                    countGridPositon(layer);
                },
                drag: function(layer){
                    dragPosition(layer);
                },
                dragstop: function(layer){
                    console.log( 'is drag end?' );
                }
            });
        }
    }
}

function mapColor(color){
    if( color ){
        return color[0];
    }else{
        return null;
    }
}
function mapImgSrc(item){
    var c    = mapColor(item);
    var plus = ( item.indexOf('+') >= 0 ) ? '+' : '';
    var _    = ( item.indexOf('_') >= 0 ) ? '_' : '';
    var x    = ( item.indexOf('x') >= 0 ) ? 'x' : '';
    var i    = ( item.indexOf('i') >= 0 ) ? item.substr( item.indexOf('i'), 2 ) : '';

    if( item.indexOf('X') >= 0 ){
        item = 'x'+i ;
    }else if( item.indexOf('q') >= 0 ){
        item = 'q'+i+x ;
    }else if( item.indexOf('k') >= 0 ){
        item = c+'k'+i+x ;
    }else{
        item = c+plus+_+i+x ;
    }

    return "img/Icon/"+item+".png";
}
function randomBySeed(){    
    var rand = Math.sin(COLOR_RANDOM++) * 10000;
    return rand - Math.floor(rand);
}

function newElementByID(id){
    var td_seat = id%TD_NUM;
    var colors = TEAM_COLORS[td_seat];
    var rand = randomBySeed();
    var color = 'w';

    for( var c in colors ){
        if( rand <= colors[c] ){
            color = c;
            break;
        }
    }
    if( color in COLOR_MAP ){
        color = COLOR_MAP[color];
    }

    return newElementByItem(color);
}
function newElementByItem(item){
    var color = mapColor(item);
    if( color ){
        var src_path = mapImgSrc(item);
        var strong = item.indexOf('+') >= 0 ? 1 : undefined;
        var inhibit = ( item.indexOf('x') >= 0 || item.indexOf('X') >= 0 ) ? 1 : undefined;
        var locking = item.indexOf('k') >= 0 ? 1 : undefined;

        var frozen = item.indexOf('i') >= 0 ? 0 : undefined;
        if( item.indexOf('i') >= 0 ){
            frozen = parseInt( item[ item.indexOf('i') + 1 ] );
        }

        data = {
            color    : color,
            item     : item,
            src_path : src_path,
            strong   : strong,
            inhibit  : inhibit,
            locking  : locking,
            frozen   : frozen,
        };

        return data;
    }else{
        return null;
    }
}
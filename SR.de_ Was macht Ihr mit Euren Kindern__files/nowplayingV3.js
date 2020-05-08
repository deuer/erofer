$(document).ready(function() {

    console.log("nowplaying");
    var URL_FORTSCHRITT = '/sr/epg/fortschritt.jsp';
    var URL_EPG			= '/sr/epg/nowPlaying.jsp';
    var IMG_PFAD		= '/sr/livestream/';
    var URL_TI 			= '//musikrecherche.sr.de/sophora/titelinterpret.php';

    var updateTiEvery 	= 45;
    var updateEpgEvery 	= 300;
    var titleLength = 15;
    var modLength = 21;
    var updateStations = [];

    if($(".nowplaying--sr1").length  > 0) {
        updateStations.push("sr1");
    }

    if($(".nowplaying--sr2").length  > 0) {
        updateStations.push("sr2");
    }

    if($(".nowplaying--sr3").length  > 0) {
        updateStations.push("sr3");
    }

    if($(".nowplaying--unserding").length  > 0) {
        updateStations.push("unserding");
    }

    if($(".nowplaying--antenne").length  > 0) {
        updateStations.push("antenne");
    }

    if($(".nowplaying--sr").length  > 0) {
        updateStations.push("srtv");
    }

    if(updateStations.length  > 0) {
        updateStations.forEach(function (s, i, o) {
            updateEPG(s);
            setInterval (function() { updateEPG(s); }, updateEpgEvery*1000);
            if (s != "srtv") {
                isRadio = true;
            }
        });
        if (isRadio == true) {
            updateTI();
            setInterval (function() { updateTI(); }, updateTiEvery*1000);
        }
    }

    function kuerzen(text,laenge) {
        return (text.length > laenge ? text.substr(0,laenge) + ".." : text );
    }


    function filterModerator(mod) {
        if (typeof mod === 'undefined') { return ""; }
        if (mod.match(/Bildunterschrift|Fernsehen|\d/i))
        { return kuerzen(mod,modLength); } else  { return "mit "+kuerzen(mod,modLength); }
    }


    function kuerzeTitel(titel) {
        if (titel.indexOf(" - ") > -1)
        { var k=(titel.split(/ \- /))[1];
            return kuerzen(k,titleLength);
        } else  { return kuerzen(titel,titleLength); }
    }

    function updateEPG(mWelle) {

        var domWelle = (mWelle == "srtv" ? "sr" : mWelle);

        $.ajax({ url : URL_EPG+'?welle='+mWelle, dataType:"json" })
            .done(function(data) {
                if (typeof data["now playing"][mWelle] !== "undefined") {
                    var dieseWelleJetzt = data["now playing"][mWelle];
                } else {
                    return false;
                }

                if (typeof dieseWelleJetzt.start !== "undefined" && typeof dieseWelleJetzt.ende !== "undefined") {
                    $('.nowplaying--' + domWelle + ' .nowplaying__content__text--subhead').text(dieseWelleJetzt.start + ' - ' + dieseWelleJetzt.ende);
                }

                if (typeof dieseWelleJetzt.moderator !== "undefined") {
                    $('.nowplaying--' + domWelle + ' .nowplaying__content__text--subheadline').text(filterModerator(dieseWelleJetzt.moderator));
                }

                if (typeof dieseWelleJetzt.titel !== "undefined") {
                    $('.nowplaying--' + domWelle + ' .nowplaying__content__text--headline').text(kuerzeTitel(dieseWelleJetzt.titel));
                }

                setFortschritt('.nowplaying--' + domWelle , dieseWelleJetzt.start, dieseWelleJetzt.ende);

                if (typeof dieseWelleJetzt.bild !== "undefined") {
                    $('.nowplaying--' + domWelle + ' .teaser-content-holder__image169 img')
                        .attr('src',dieseWelleJetzt.bild.id + '~_v-sr__169__313.jpeg')
                        .attr('sizes', '(min-width: 980px) 645px,(min-width: 640px) 66vw, 100vw')
                        .attr('srcset', generateSrcset(dieseWelleJetzt.bild.id))
                        .attr('alt', dieseWelleJetzt.bild.alt);
                }
            });
    }

    function generateSrcset(id) {
        strukturknoten = IMG_PFAD;
        rueckgabe =   strukturknoten + id + '~_v-sr__169__1440.jpeg 1440w, '
            + strukturknoten + id + '~_v-sr__169__1280.jpeg 1280w, '
            + strukturknoten + id + '~_v-sr__169__1000.jpeg 1000w, '
            + strukturknoten + id + '~_v-sr__169__900.jpeg 900w, '
            + strukturknoten + id + '~_v-sr__169__640.jpeg 640w, '
            + strukturknoten + id + '~_v-sr__169__600.jpeg 600w, '
            + strukturknoten + id + '~_v-sr__169__500.jpeg 500w, '
            + strukturknoten + id + '~_v-sr__169__460.jpeg 460w, '
            + strukturknoten + id + '~_v-sr__169__313.jpeg 313w, '
            + strukturknoten + id + '~_v-sr__169__300.jpeg 300w, '
            + strukturknoten + id + '~_v-sr__169__240.jpeg 240w';
        return rueckgabe;
    }

    function setFortschritt(klasse, start, ende) {
        $.get( URL_FORTSCHRITT + '?start=' + start + '&ende=' + ende, function( data ) {
            fortschritt = data;
            $(klasse + ' .nowplaying__timeline').width(fortschritt);
        });
    }

    function updateTI() {
        $.ajax({
            url : URL_TI,
            dataType:"json" })
            .done(function(data) {1
                titelinterpret = data;
                // TITEL/INTERPRET
                if (typeof titelinterpret.sr1 != 'undefined') {
                    $('.nowplaying--sr1 .nowplaying__content__text--title').html(titelinterpret.sr1.interpret + ' - ' + titelinterpret.sr1.titel);
                }
                if (typeof titelinterpret.sr2 != 'undefined') {
                    $('.nowplaying--sr2 .nowplaying__content__text--title').html(titelinterpret.sr2.interpret + ' - ' + titelinterpret.sr2.titel);
                }
                if (typeof titelinterpret.sr3 != 'undefined') {
                    $('.nowplaying--sr3 .nowplaying__content__text--title').html(titelinterpret.sr3.interpret + ' - ' + titelinterpret.sr3.titel);
                }
                if (typeof titelinterpret.unserding != 'undefined') {
                    $('.nowplaying--unserding .nowplaying__content__text--title').html(titelinterpret.unserding.interpret + ' - ' + titelinterpret.unserding.titel);
                }
            });
    }
});
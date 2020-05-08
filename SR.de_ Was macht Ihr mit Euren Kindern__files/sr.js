function srPlayNow (url) {
   fenster = window.open(url, "Livestream", "width=640,height=740,status=yes,scrollbars=yes,resizable=yes");
   fenster.focus();
}
function srpixelIVW(ivwRubrik,ivwPath5){
  var iam_data = {
  "st":"sronline",
  "cp":ivwRubrik,
  "co":ivwPath5
  }
  iom.c(iam_data,1);
}
function srpixelIVWneu(ivwRubrik,ivwPath5neu){
     window.setTimeout(function() {
         var ak_stat = "sronline";
         var ak_mobi = "mobsronl";
    
         function isStringDetected(value) {
             var regexp = new RegExp(value, "gi");
             return (regexp.test(navigator.appVersion) || regexp.test (navigator.userAgent)) ? true : false;
         }
         
         function isTablet() {
             if(isStringDetected("iPad|Windows NT|Kindle|PlayBook") || (isStringDetected("Android") && !isStringDetected("Mobile"))) {
                  return true;
                  }
             return false;
             }
                                      
             /* SZMnG-Tag Responsiv-Weiche */
             jQuery.ajaxSetup({ cache: true });
             jQuery.getScript("https://script.ioam.de/iam.js").done(function() {
                 var isMobil = typeof orientation!='undefined' ? true:false;
                 if(isTablet()) { isMobil = false; } // Tablets zählen stationär
                 if(!isMobil) {
                    var iam_data = {
                       "st" : ak_stat,
                       "cp" : ivwPath5neu,
                       };
                 
                 } else {
                    var iam_data = {
                       "st" : ak_mobi,
                       "cp" : ivwPath5neu,
                       };
                 }
                                                                                                
                 iom.c(iam_data,1);
             
             });
       }, 1);
}
function srpixelATI(atiRubrik,pagename){
    xtnv = document;         
    xtsd = "https://logs1242";
    xtsite = "495002";
    xtn2 = atiRubrik;
    xtpage = pagename;
    xtdi = "";
    xt_multc = "";
    xt_an = "";
    xt_ac = "";
    xt_xtcpath = "www.sr.de/sr/static/js/xtcore.js";
    //do not modify below
    if (window.xtparam!=null){window.xtparam+="&ac="+xt_ac+"&an="+xt_an+xt_multc;}
    else{window.xtparam="&ac="+xt_ac+"&an="+xt_an+xt_multc;};
    (function(){      
      var at=document.createElement('script'); 
        at.type='text/javascript';   
        at.async=true;    
        at.src='https://'+xt_xtcpath;
        (document.getElementsByTagName('head')[0]||document.getElementsByTagName('body')[0]||document.getElementsByTagName('script')[0].parentNode).insertBefore(at,null);   
        })();
}
function srpixelATIneu(level2, chapter1, chapter2, chapter3, page){
    //tag allocation
    var tag = new ATInternet.Tracker.Tag({secure: true});

    //init pixel - with empty variables check, otherwise we will get empty chapters
    if(chapter1 != '' && chapter2 != '' && chapter3 != ''){
        tag.page.set({
            name: "'" + page + "'",
            chapter1:"'" + chapter1 + "'",
            chapter2:"'" + chapter2 + "'",
            chapter3:"'" + chapter3 + "'",
            level2: "'" + level2 + "'"
        });
    } else if (chapter1 != '' && chapter2 != ''){
        tag.page.set({
            name: "'" + page + "'",
            chapter1:"'" + chapter1 + "'",
            chapter2:"'" + chapter2 + "'",
            level2: "'" + level2 + "'"
        });
    } else if (chapter1 != ''){
        tag.page.set({
            name: "'" + page + "'",
            chapter1:"'" + chapter1 + "'",
            level2: "'" + level2 + "'"
        });
    } else {
        tag.page.set({
            name: "'" + page + "'",
            level2: "'" + level2 + "'"
        });
    }
    //sending pixel
    tag.dispatch();
}

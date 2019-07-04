var tab = [];
var ver = "ja";
var vS = nr;
var mod = "babr";
//ZMIANA TYTUŁÓW
var INDEX;
var NUMBER;
var player = GetPlayer(); //interface z loadToArticulate
var obj = document.getElementsByClassName("cs-listitem list-item cs-selected menu-item-selected")[0]; //tworzenie objektu z wybranym slajdem
var ilosc_obj = obj.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByTagName('span').length;
if (obj.parentElement.parentElement.parentElement.getElementsByTagName('span').length < (ilosc_obj - 1)) { //sprawdzanie, czy jestem w zagnieżdżonym slajdzie
    player.SetVar("text_tytul_rozdzial", obj.parentElement.parentElement.parentElement.getElementsByTagName('span')[2].innerText); //ustawia zmienną "text_tytul_rozdzial" na element który jest tytułem rozdziału
    player.SetVar("text_tytul_pod_rozdzial_1", obj.innerText); // ustawia zmienną "text_tytul_rozdzial" na element który jest tytułem pod rozdziału
} else { // jeśli nie jestem w zagnieżdżonym slajdzie to wypisuje tylko tytuł
    player.SetVar("text_tytul_rozdzial", obj.innerText); //ustawia zmienną "text_tytul_rozdzial" na element który jest tytułem rozdziału
}
$("body").css("overflow", "hidden"); //usuwanie scrolla
loadManifestXML();
//FUNKCJE
function ifRepeating() {
    var R = -1;
    for (j = 0; j < tab.length; j++) {
        if (document.getElementsByClassName("cs-listitem list-item cs-selected menu-item-selected")[0].innerText == (tab[j])) {
            R++;
        }
    }
    if (R >= 1) {
        return true;
    } else {
        return false;
    }
}

function read() {
    for (i = 0; i < tab.length; i++) {
        if (document.getElementsByClassName("cs-listitem list-item cs-selected menu-item-selected")[0].innerText == (tab[i]) && ifRepeating() == false) {
            if (ver == "de") {
                NUMBER = i;
                player.SetVar("sys_Slajd", i);
                if ((i - 1) + vS <= 9) {
                    INDEX = mod + "_000" + ((i - 1) + vS);
                    player.SetVar("sys_Index", mod + "_000" + ((i - 1) + vS));
                }
                if ((i - 1) + vS <= 99 && (i - 1) + vS >= 10) {
                    INDEX = mod + "_00" + ((i - 1) + vS);
                    player.SetVar("sys_Index", mod + "_00" + ((i - 1) + vS));
                }
                if ((i - 1) + vS <= 999 && (i - 1) + vS >= 100) {
                    INDEX = mod + "_0" + ((i - 1) + vS);
                    player.SetVar("sys_Index", mod + "_0" + ((i - 1) + vS));
                }
            } else {
                NUMBER = i;
                player.SetVar("sys_Slajd", (i + 1));
                if (i + vS <= 9) {
                    INDEX = mod + "_000" + (i + vS);
                    player.SetVar("sys_Index", mod + "_000" + (i + vS));
                }
                if (i + vS <= 99 && i + vS >= 10) {
                    INDEX = mod + "_00" + (i + vS);
                    player.SetVar("sys_Index", mod + "_00" + (i + vS));
                }
                if (i + vS <= 999 && i + vS >= 100) {
                    INDEX = mod + "_0" + (i + vS);
                    player.SetVar("sys_Index", mod + "_0" + (i + vS));
                }
            }
        }
    }
}

function loadManifestXML() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            manifestNodes(this);
        }
    };
    if (ver == "de") {
        xmlhttp.open("GET", "de/scomanifest.xml", true);
    } else {
        xmlhttp.open("GET", ver + "/manifest_" + ver + ".xml", true);
    }
    xmlhttp.send();
}

function manifestNodes(xml) {
    var x, i, xmlDoc, txt;
    xmlDoc = xml.responseXML;
    txt = "";
    if (ver == "de") {
        x = xmlDoc.getElementsByTagName("title");
    } else {
        x = xmlDoc.getElementsByTagName("itemtitle");
    }
    for (i = 0; i < x.length; i++) {
        tab[i] = x[i].childNodes[0].nodeValue;
//        tab[i] = tab[i].replace(/(\r\n|\n|\r)/gm, ""); // tytuły bez podwójnych spacjii....
    }
    read();
    loadXML();
}

function loadXML() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            itemNodes(this);
        }
    };
    xmlhttp.open("GET", ver + "/" + getName(), true);
    xmlhttp.send();
}

function itemNodes(xml) {
    var x, i, xmlDoc, txt;
    xmlDoc = xml.responseXML;
    txt = "";
    x = xmlDoc.getElementsByTagName("tf");
    for (i = 0; i < x.length; i++) {
        tab[i] = x[i].childNodes[0].nodeValue;
        tab[i] = tab[i].replace(/(\n)/gm, " ");
        while (tab[i].charAt(0) === ' ') {
            tab[i] = tab[i].substr(1);
        }
    }
    loadToArticulate();
}

function getName() {
    var wr = 1;
    var fName = "sco_";
    var sName = "_" + wr + "_" + ver + ".xml";
    return (fName + INDEX + sName);
}

function loadToArticulate() {
    for (i = 0; i < tab.length; i++) {
        player.SetVar("ex_var_" + i, tab[i]);
    }
}
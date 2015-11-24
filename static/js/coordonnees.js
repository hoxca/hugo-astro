/*

Copyright (C) 2012  Observatoire de Paris

The JavaScript code in this page is free software: you can
redistribute it and/or modify it under the terms of the GNU
General Public License (GNU GPL) as published by the Free Software
Foundation, either version 3 of the License, or (at your option)
any later version.  The code is distributed WITHOUT ANY WARRANTY;
without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.

As additional permission under GNU GPL version 3 section 7, you
may distribute non-source (e.g., minimized or compacted) forms of
that code without the copy of the GNU GPL normally required by
section 4, provided you include this license notice and a URL
through which recipients can access the Corresponding Source.

*/

if (!Math.toRadians) {
    Math.toRadians = function(x) {
        return(x * Math.PI / 180);
    }
}
if (!Math.toDegrees) {
    Math.toDegrees = function(x) {
        return(x * 180 / Math.PI);
    }
}

var canvas;
var context;
var minAlpha = Math.toRadians(0);
var maxAlpha = Math.toRadians(360);
var minDelta = Math.toRadians(-90);
var maxDelta = Math.toRadians(90);
var minPhi = Math.toRadians(-90);
var maxPhi = Math.toRadians(90);
var minL = Math.toRadians(-180);
var maxL = Math.toRadians(180);
var minHeure = 0;
var maxHeure = 23;
var minJour = 1;
var maxJour = 31; // dépend du mois
var minMois = 1;
var maxMois = 12;
var minAnnee = 2000;
var maxAnnee = 2020;
var alphaInitial = Math.toRadians(67.50); // 4h 30m
var deltaInitial = Math.toRadians(28); // +28°
var phiInitial = Math.toRadians(49); // latitude 49° Nord
var LInitial = Math.toRadians(2); // longitude 2° Est
var heureInitiale = 3;
var jourInitial = 24;
var moisInitial = 11;
var anneeInitiale = 2015;
var couleurEquateur = 'rgba(150, 255, 200, 0.8)';
var couleurTexteEquateur = 'rgb(100, 200, 150)';
var couleurHorizon = 'rgba(250, 210, 170, 0.8)';
var couleurTexteHorizon = 'rgb(200, 150, 100)';
var couleurEtoile = 'rgb(255, 255, 0)';
var couleurAlpha = 'rgb(255, 50, 50)';
var couleurDelta = 'rgb(50, 50, 255)';
var couleurPhi = 'rgb(50, 130, 50)';
var couleurArcs = 'lightgray';
var couleurAngleA = 'rgb(150, 100, 50)';
var couleurAngleH = 'rgb(50, 150, 100)';
var couleurAngleHauteur = 'rgb(150, 50, 150)';
var precisionCourbes = 100;
var imgdimx;
var imgdimy;
var sliderAlpha, sliderDelta, sliderPhi, sliderL, sliderHeure, sliderJour, sliderMois, sliderAnnee;
var alpha, delta, phi, L;
var heure, jour, mois, annee;
var H = Math.PI / 3; // angle horaire
var cx, cy; // position du centre de l'image en pixels
var rayon; // rayon du grand cercle en pixels
var labelAlpha, labelDelta, labelPhi, labelL, labelHeure, labelJour, labelMois, labelAnnee;
var labelInfos;
var rotObservateur; // matrice de rotation par rapport à l'observateur
var rotEquateur; // matrice de rotation de l'équateur céleste par rapport à l'horizon
var rotObsEq; // rotObservateur * rotEquateur
var O, Nord, Sud, Est, Ouest, Z; // points en coordonnées sphériques
var titreAlpha, titreDelta, titrePhi, titreGamma;
var idTimeout = 0;

function init() {
    canvas = document.getElementById('dessin');
    var largeur_fenetre = 'innerWidth' in window ? window.innerWidth : document.documentElement.offsetWidth;
    var hauteur_fenetre = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
    imgdimx = Math.min(largeur_fenetre - 350, hauteur_fenetre - 50);
    if (imgdimx <= 0)
        imgdimx = 500;
    imgdimx = 420;
    imgdimy = imgdimx;
    canvas.width = imgdimx;
    canvas.height = imgdimy;
    context = canvas.getContext('2d');
    context.translate(0.5, 0.5);
    context.font = 'bold 12px sans-serif';


    labelInfos = document.getElementById('infos');

    alpha = alphaInitial;
    titreAlpha = '\u03B1';
    labelAlpha = document.getElementById('valeurAlpha');
    setLabelText(labelAlpha, titreAlpha + " = " + affichageAngleHMS(alpha));
    labelAlpha.style.color = couleurAlpha;
    sliderAlpha = new Curseur('curseurAlpha', 0, 24, Math.round(24 * (alpha - minAlpha) / (maxAlpha - minAlpha)), 97, false, modifCurseur);

    delta = deltaInitial;
    titreDelta = '\u03B4';
    labelDelta = document.getElementById('valeurDelta');
    setLabelText(labelDelta, titreDelta + " = " + affichageAngleDMS(delta, false, false));
    labelDelta.style.color = couleurDelta;
    sliderDelta = new Curseur('curseurDelta', -90, 90, Math.round(180 * (delta - minDelta) / (maxDelta - minDelta) - 90), 181, false, modifCurseur);

    phi = phiInitial;
    titrePhi = '\u03C6';
    labelPhi = document.getElementById('valeurPhi');
    setLabelText(labelPhi, titrePhi + " = " + affichageAngleDMS(phi, false, false));
    labelPhi.style.color = couleurPhi;
    sliderPhi = new Curseur('curseurPhi', -90, 90, Math.round(180 * (phi - minPhi) / (maxPhi - minPhi) - 90), 181, false, modifCurseur);

    L = LInitial;
    labelL = document.getElementById('valeurL');
    setLabelText(labelL, 'L = ' + affichageAngleDMS(Math.abs(L), true, false));
    sliderL = new Curseur('curseurL', -180, 180, Math.round(360 * (L - minL) / (maxL - minL) - 180), 181, false, modifCurseur);

    heure = heureInitiale;
    labelHeure = document.getElementById('valeurHeure');
    setLabelText(labelHeure, 'Heure = ' + heure + 'h TU');
    sliderHeure = new Curseur('curseurHeure', minHeure, maxHeure, heure, maxHeure - minHeure + 1, false, modifCurseur);

    jour = jourInitial;
    labelJour = document.getElementById('valeurJour');
    setLabelText(labelJour, 'Jour = ' + jour);
    sliderJour = new Curseur('curseurJour', minJour, maxJour, jour, maxJour - minJour + 1, false, modifCurseur);

    mois = moisInitial;
    labelMois = document.getElementById('valeurMois');
    setLabelText(labelMois, 'Mois = ' + mois);
    sliderMois = new Curseur('curseurMois', minMois, maxMois, mois, maxMois - minMois + 1, false, modifCurseur);

    annee = anneeInitiale;
    labelAnnee = document.getElementById('valeurAnnee');
    setLabelText(labelAnnee, 'Année = ' + annee);
    sliderAnnee = new Curseur('curseurAnnee', minAnnee, maxAnnee, annee, maxAnnee - minAnnee + 1, false, modifCurseur);

    titreGamma = '\u03B3';

    rotObservateur = new Matrice(3, 3);
    rotEquateur = new Matrice(3, 3);
    O = new Vecteur3D(0, 0, 0);
    Nord = new Vecteur3D(1, Math.PI / 2, -Math.PI / 2);
    Sud = new Vecteur3D(1, Math.PI / 2, Math.PI / 2);
    Est = new Vecteur3D(1, Math.PI / 2, Math.PI);
    Ouest = new Vecteur3D(1, Math.PI / 2, 0);
    Z = new Vecteur3D(1, 0, 0);

    majCroquis();
}

function setLabelText(label, texte) {
    var first = label.firstChild;
    if (first == null) {
        label.appendChild(document.createTextNode(texte));
        return;
    } else
        first.nodeValue = texte;
}

function modifCurseur(e) {
    var id = e.target.id;
    if (id == 'curseurAlpha') {
        var valeur = sliderAlpha.getValeur();
        alpha = valeur * Math.PI / 12;
        setLabelText(labelAlpha, titreAlpha + ' = ' + affichageAngleHMS(alpha));
    } else if (id == 'curseurDelta') {
        var valeur = sliderDelta.getValeur();
        delta = Math.toRadians(valeur);
        setLabelText(labelDelta, titreDelta + ' = ' + affichageAngleDMS(delta, false, false));
    } else if (id == 'curseurPhi') {
        var valeur = sliderPhi.getValeur();
        phi = Math.toRadians(valeur);
        setLabelText(labelPhi, titrePhi + ' = ' + affichageAngleDMS(phi, false, false));
    } else if (id == 'curseurL') {
        var valeur = sliderL.getValeur();
        L = Math.toRadians(valeur);
        setLabelText(labelL, 'L = ' + affichageAngleDMS(L, true, false));
    } else if (id == 'curseurHeure') {
        var valeur = sliderHeure.getValeur();
        heure = Math.round(valeur);
        setLabelText(labelHeure, 'Heure = ' + heure + 'h TU');
    } else if (id == 'curseurJour') {
        var valeur = sliderJour.getValeur();
        jour = valeur;
        setLabelText(labelJour, 'Jour = ' + jour);
    } else if (id == 'curseurMois') {
        var valeur = sliderMois.getValeur();
        mois = valeur;
        setLabelText(labelMois, 'Mois = ' + mois);
        maxJour = joursParMois(mois, annee);
        sliderJour.setMaximum(maxJour);
        sliderJour.setNbpas(maxJour - minJour + 1);
        sliderJour.afficher();
    } else if (id == 'curseurAnnee') {
        var valeur = sliderAnnee.getValeur();
        annee = valeur;
        setLabelText(labelAnnee, 'Année = ' + annee);
        maxJour = joursParMois(mois, annee);
        sliderJour.setMaximum(maxJour);
        sliderJour.setNbpas(maxJour - minJour + 1);
        sliderJour.afficher();
    }
    if (idTimeout != 0)
        clearTimeout(idTimeout);
    idTimeout = setTimeout(majCroquis, 0);
}

function majCroquis() {
    // calcul du temps sidéral
    // Jour Julien le 1/1/2000 à 0 h UTC : 2451544.5
    var jours = jour - 1; // jours écoulés depuis le 1/1/2000
    for (var i=2000; i<annee; i++)
        jours += joursParAn(i);
    for (var i=1; i<12; i++) {
        if (mois > i)
            jours += joursParMois(i, annee);
    }

    var T = (2451544.5 + jours - 2451545) / 36525.; // en siecles juliens depuis le 1/1/2000 à 12h
    // temps sidéral moyen à Greenwich à 0hTU :
    var GMST0 = 24110.54841 + 8640184.812866*T + 0.093104*Math.pow(T,2) - 6.2E-6*Math.pow(T,3); // en secondes
    GMST0 = GMST0 % 86400; // en s (24h = 86400s)
    var TSG = GMST0 + 1.00273790935 * (heure*3600); // en s
    TSG = TSG % 86400;
    var TSL = TSG * ((2*Math.PI)/86400) + L; // en radians
    H = TSL - alpha;
    if (H < 0)
        H += 2 * Math.PI;

    var aobs = 0.2; // angle d'observation
    rotObservateur.set(0, 0, Math.cos(aobs));
    rotObservateur.set(0, 1, 0);
    rotObservateur.set(0, 2, -Math.sin(aobs));
    rotObservateur.set(1, 0, 0);
    rotObservateur.set(1, 1, 1);
    rotObservateur.set(1, 2, 0);
    rotObservateur.set(2, 0, Math.sin(aobs));
    rotObservateur.set(2, 1, 0);
    rotObservateur.set(2, 2, Math.cos(aobs));

    var cphi = Math.PI / 2 - phi; // angle de l'équateur par rapport à l'horizon
    rotEquateur.set(0, 0, 1);
    rotEquateur.set(0, 1, 0);
    rotEquateur.set(0, 2, 0);
    rotEquateur.set(1, 0, 0);
    rotEquateur.set(1, 1, Math.cos(cphi));
    rotEquateur.set(1, 2, Math.sin(cphi));
    rotEquateur.set(2, 0, 0);
    rotEquateur.set(2, 1, -Math.sin(cphi));
    rotEquateur.set(2, 2, Math.cos(cphi));

    rotObsEq = rotObservateur.produitM(rotEquateur);

    context.fillStyle = 'white';
    context.fillRect(0, 0, imgdimx, imgdimy);
    cx = imgdimx / 2;
    cy = imgdimy / 2;
    rayon = Math.min(cx - 20, cy - 20); // rayon de la sphère en pixels

    context.beginPath();
    context.fillStyle = 'rgb(230, 230, 255)';
    context.arc(cx, cy, rayon, 0, 2*Math.PI, false);
    context.fill();

    context.strokeStyle = '#707070';
    context.stroke();

    var M = new Vecteur3D(1, Math.PI / 2 - delta, Math.PI / 2 - H); // position de l'étoile dans le repère de l'équateur
    if (M.get(2) < -Math.PI)
        M.set(2, M.get(2) + 2 * Math.PI); // pour avoir la 3ème coordonnée entre -pi et pi
    var Mcart = M.spheriquesVersCartesiennes();
    var McartHoz = rotEquateur.produitV(Mcart); // rotation équateur -> horizon
    var MsphHoz = McartHoz.cartesiennesVersSpheriques(); // coordonnées sphériques de M dans le repère de l'horizon
    var ptM = conversion(M, true);
    var ptO = new Point2D(cx, cy);
    var B = new Vecteur3D(1, Math.PI / 2, Math.PI / 2 - H); // repère équatorial
    if (B.get(2) < -Math.PI)
        B.set(2, B.get(2) + 2 * Math.PI);
    var ptB = conversion(B, true);
    var ptNord = conversion(Nord, false);
    var P = new Vecteur3D(1, Math.PI / 2 - phi, -Math.PI / 2);
    var ptP = conversion(P, false);
    var A = new Vecteur3D(1, Math.PI / 2, MsphHoz.get(2)); // repère de l'horizon
    var pointVernal = new Vecteur3D(1, Math.PI / 2, Math.PI/2 - (H + alpha)); // repère équateur
    if (pointVernal.get(2) < -Math.PI)
        pointVernal.set(2, pointVernal.get(2) + 2 * Math.PI);

    // arc ZMA
    dessinArcZMA(Z, MsphHoz, A, false);

    // arc PMB
    dessinArcPMB(P, M, B, false);

    dessinEtoile(M, ptM, MsphHoz, false);

    dessinAngleDelta(B, M, false);

    dessinAngleHauteur(A, MsphHoz, false);

    // affichage cercle de l'équateur céleste (derrière)
    var pt;
    context.beginPath();
    pt = conversion(new Vecteur3D(1, Math.PI / 2, 0), true);
    context.moveTo(pt.x, pt.y);
    for (var i=1; i<=precisionCourbes; i++) {
        pt = conversion(new Vecteur3D(1, Math.PI / 2, - (i / precisionCourbes) * Math.PI), true);
        context.lineTo(pt.x, pt.y);
    }
    context.closePath();
    context.fillStyle = couleurEquateur;
    context.fill();

    // angle H (angle horaire) (partie derrière l'horizon)
    dessinAngleHoraire(B, false);

    dessinAngleAlpha(pointVernal, B, false);

    // angle a (azimut) (partie derrière l'horizon)
    if (MsphHoz.get(1) > 1E-5 && MsphHoz.get(1) < Math.PI - 1E-5) // étoile au zénith: azimut indéterminé
        dessinAngleAzimut(A, false);

    dessinHorizon();

    // calcul cercle de l'équateur céleste (devant)
    context.beginPath();
    pt = conversion(new Vecteur3D(1, Math.PI / 2, 0), true);
    context.moveTo(pt.x, pt.y);
    for (var i=1; i<=precisionCourbes/2; i++) {
        pt = conversion(new Vecteur3D(1, Math.PI / 2, (i / Math.floor(precisionCourbes/2)) * Math.PI), true);
        context.lineTo(pt.x, pt.y);
    }
    context.closePath();
    // affichage cercle de l'équateur céleste (devant)
    context.fillStyle = couleurEquateur;
    context.fill();
    context.fillStyle = couleurTexteEquateur;
    if (phi > 0) {
        pt = conversion(Ouest, false);
        context.save();
        context.translate(pt.x, pt.y);
        context.rotate(phi - Math.PI/2);
        context.translate(-pt.x, -pt.y);
        context.fillText('Equateur céleste', pt.x - rayon * 0.75, pt.y + 10);
        context.restore();
    } else {
        pt = conversion(Est, false);
        context.save();
        context.translate(pt.x, pt.y);
        context.rotate(phi + Math.PI/2);
        context.translate(-pt.x, -pt.y);
        context.fillText('Equateur céleste', pt.x - rayon * 0.75, pt.y - 5);
        context.restore();
    }

    dessinArcZMA(Z, MsphHoz, A, true);

    dessinArcPMB(P, M, B, true);

    dessinEtoile(M, ptM, MsphHoz, true);

    // angle H (angle horaire) (partie devant l'horizon)
    dessinAngleHoraire(B, true);

    dessinAngleAlpha(pointVernal, B, true);

    dessinAngleDelta(B, M, true);

    dessinAnglePhi(P);

    // angle a (azimut) (partie devant l'horizon)
    if (MsphHoz.get(1) > 1E-5 && MsphHoz.get(1) < Math.PI - 1E-5) // étoile au zénith: azimut indéterminé
        dessinAngleAzimut(A, true);

    // angle h (hauteur du soleil)
    dessinAngleHauteur(A, MsphHoz, true);

    // points
    context.fillStyle = 'black';
    context.strokeStyle = 'black';

    // affichage des points fixes
    context.font = '12px sans-serif';
    afficherPoint(O, false, true, 'O');
    afficherPoint(Nord, false, true, 'Nord');
    afficherPoint(Sud, false, true, 'Sud');
    afficherPoint(Est, false, true, 'Est');
    afficherPoint(Ouest, false, true, 'Ouest');
    afficherPoint(Z, false, true, 'Z');

    // affichage des points en mouvement
    context.font = 'bold 12px sans-serif';
    afficherPoint(P, false, true, 'P');

    //afficherPoint(B, true, true, 'B');
    //afficherPoint(A, false, true, 'A');
    //afficherPoint(M, true, true, 'M');
    afficherPoint(pointVernal, true, true, titreGamma);

    // avec une image offscreen, ce serait le bon moment pour lancer la mise à jour...

    var infos = 'H=' + affichageAngleDMS(H, false, true) + ' \u00a0 h=' + affichageAngleDMS(Math.PI/2 - MsphHoz.get(1), false, false);
    if (MsphHoz.get(1) > 1E-5 && MsphHoz.get(1) < Math.PI - 1E-5) {
        var azimut = Math.PI/2 - A.get(2);
        if (azimut < 0)
            azimut += 2*Math.PI;
        infos += ' \u00a0 a=' + affichageAngleDMS(azimut, false, true);
    }

    setLabelText(labelInfos, infos);
    idTimeout = 0;
}

function dessinHorizon() {
    context.beginPath();
    var pt = conversion(new Vecteur3D(1, Math.PI / 2, 0), false);
    context.moveTo(pt.x, pt.y);
    for (var i=1; i<precisionCourbes/2; i++) {
        pt = conversion(new Vecteur3D(1, Math.PI / 2, (i / Math.floor(precisionCourbes/2)) * (2 * Math.PI)), false);
        context.lineTo(pt.x, pt.y);
    }
    context.closePath();
    context.fillStyle = couleurHorizon;
    context.fill();
    context.fillStyle = couleurTexteHorizon;
    pt = conversion(Ouest, false);
    context.save();
    context.translate(pt.x, pt.y);
    context.rotate(-0.1);
    context.translate(-pt.x, -pt.y);
    context.fillText('Horizon céleste', pt.x + rayon / 4, pt.y + 20);
    context.restore();
}

//protected void dessinEtoile(final Vecteur M, final Point2D ptM, final Vecteur MsphHoz, final boolean devant)
function dessinEtoile(M, ptM, MsphHoz, devant) {
    var Mdevant = (Math.cos(M.get(2)) > 0);
    if (Mdevant == devant) {
        var ex = ptM.x;
        var ey = ptM.y;
        var er = 9;
        var a, x, y;
        var ta = [2, 4, 1, 3];
        a = Math.PI / 2;
        x = ex + er * Math.cos(a);
        y = ey - er * Math.sin(a);
        context.beginPath();
        context.moveTo(x, y);
        for (var i=0; i<ta.length; i++) {
            a = ta[i] * (2 * Math.PI / 5) + Math.PI / 2;
            x = ex + er * Math.cos(a);
            y = ey - er * Math.sin(a);
            context.lineTo(x, y);
        }
        context.closePath();
        context.strokeStyle = 'black';
        context.stroke();
        context.fillStyle = couleurEtoile;
        context.fill();
    }
}

//protected void dessinArcZMA(final Vecteur Z, final Vecteur MsphHoz, final Vecteur A, final boolean devant)
function dessinArcZMA(Z, MsphHoz, A, devant) {
    var Adevant = (Math.cos(A.get(2)) > 0);
    if (Adevant == devant) {
        context.strokeStyle = couleurArcs;
        var Zbis = new Vecteur3D(1, 0, MsphHoz.get(2)); // Z avec le même phi que SsphHoz
        dessinArc(Zbis, MsphHoz.get(1) < A.get(1) ? MsphHoz : A, true, false, false);
    }
}

//protected void dessinArcPMB(final Vecteur P, final Vecteur M, final Vecteur B, final boolean devant)
function dessinArcPMB(P, M, B, devant) {
    var Bdevant = (Math.cos(B.get(2)) > 0);
    if (Bdevant == devant) {
        context.strokeStyle = couleurArcs;
        var PEq = new Vecteur3D(1, 0, M.get(2)); // P dans le repère équatorial, avec le même phi que S
        dessinArc(PEq, M.get(1) < B.get(1) ? M : B, true, true, false);
    }
}

//protected void dessinAngleAlpha(final Vecteur pointVernal, final Vecteur B, final boolean devant)
function dessinAngleAlpha(pointVernal, B, devant) {
    context.strokeStyle = couleurAlpha;
    context.fillStyle = couleurAlpha;
    var gammaDevant = (Math.cos(pointVernal.get(2)) > 0);
    var gammaDerriere = (Math.cos(pointVernal.get(2)) <= 0);
    var Bdevant = (Math.cos(B.get(2)) > 0);
    var Bderriere = (Math.cos(B.get(2)) <= 0);
    // début angle
    if (devant && ((gammaDevant && Bderriere) || (alpha > Math.PI && gammaDevant && Bdevant))) {
        // trait gamma-Sud (devant)
        dessinArc(pointVernal, Sud, true, true, false);
    } else if (!devant && ((gammaDerriere && Bdevant) || (alpha > Math.PI && gammaDerriere && Bderriere))) {
        // trait gamma-Nord (derrière)
        dessinArc(pointVernal, Nord, true, true, false);
    }
    // milieu
    if (alpha > Math.PI) {
        if (devant && gammaDerriere && Bderriere) {
            // trait Nord-Ouest-Sud (devant)
            dessinArc(Nord, Sud, true, true, false);
        } else if (!devant && gammaDevant && Bdevant) {
            // trait Sud-Est-Nord (derrière)
            dessinArc(new Vecteur3D(1, Math.PI/2, Math.PI/2), new Vecteur3D(1, Math.PI/2, 3*Math.PI/2), true, true, false);
        }
    }
    // fin avec la flêche
    if (devant && alpha < Math.PI && gammaDevant && Bdevant) {
        // flêche gamma-B (devant)
        dessinArc(pointVernal, B, true, true, true);
    } else if (!devant && alpha < Math.PI && gammaDerriere && Bderriere) {
        // flêche gamma-B (derrière)
        dessinArc(pointVernal, B, true, true, true);
    } else if (devant && ((gammaDerriere && Bdevant) || (alpha > Math.PI && gammaDevant && Bdevant))) {
        // flêche Nord-B (devant)
        dessinArc(new Vecteur3D(1, Math.PI/2, -Math.PI/2), B, true, true, true);
    } else if (!devant && ((gammaDevant && Bderriere) || (alpha > Math.PI && gammaDerriere && Bderriere))) {
        // flêche Sud-B (derrière)
        dessinArc(new Vecteur3D(1, Math.PI/2, Math.PI/2), B, true, true, true);
    }
    // titre
    if (devant) {
        var moyennePhi;
        if (B.get(2) - pointVernal.get(2) < 0)
            moyennePhi = pointVernal.get(2) + (B.get(2) + 2*Math.PI - pointVernal.get(2))/2;
        else
            moyennePhi = pointVernal.get(2) + (B.get(2) - pointVernal.get(2))/2;
        var pt = conversion(new Vecteur3D(1, Math.PI/2, moyennePhi), true);
        if (phi > 0)
            context.fillText(titreAlpha, (pt.x - 10), (pt.y - 5));
        else
            context.fillText(titreAlpha, (pt.x), (pt.y - 5));
    }
}

//protected void dessinAngleDelta(final Vecteur B, final Vecteur M, final boolean devant)
function dessinAngleDelta(B, M, devant) {
    context.strokeStyle = couleurDelta;
    context.fillStyle = couleurDelta;
    var Bdevant = (Math.cos(B.get(2)) > 0);
    if (devant == Bdevant) {
        dessinArc(B, M, true, true, true);
        if (Math.abs(delta) > 0.1) {
            var r;
            if ((phi >= 0 && delta >= 0) || (phi < 0 && delta < 0))
                r = 1.1;
            else
                r = 0.9;
            var pt = conversion(new Vecteur3D(r, Math.PI/2 - (Math.PI/2 - M.get(1))/2, B.get(2)), true);
            context.fillText(titreDelta, (pt.x - context.measureText(titreDelta).width/2), (pt.y + 5));
        }
    }
}

//protected void dessinAnglePhi(final Vecteur P)
function dessinAnglePhi(P) {
    context.strokeStyle = couleurPhi;
    context.fillStyle = couleurPhi;
    dessinArc(Nord, P, true, false, true);
    var pt = conversion(new Vecteur3D(1.05, Math.PI/2 - phi/2, -Math.PI/2), false);
    context.fillText(titrePhi, (pt.x - context.measureText(titrePhi).width/2), (pt.y + 5));
}

//protected void dessinAngleAzimut(final Vecteur A, final boolean devant)
function dessinAngleAzimut(A, devant) {
    var azimut = Math.PI/2 - A.get(2);
    if (azimut < 0)
        azimut += 2*Math.PI;
    var Az = new Vecteur3D(1, Math.PI / 2, Math.PI/2 - azimut);
    if ((devant && azimut <= Math.PI) || (!devant && azimut > Math.PI)) {
        context.strokeStyle = couleurAngleA;
        context.fillStyle = couleurAngleA;
        dessinArc(Sud, Az, false, false, true);
    } else if (devant && azimut > Math.PI) {
        context.strokeStyle = couleurAngleA;
        context.fillStyle = couleurAngleA;
        dessinArc(new Vecteur3D(1, Math.PI/2, Math.PI/2), new Vecteur3D(1, Math.PI/2, -Math.PI/2), false, false, false);
    }
    if (devant) {
        var pt = conversion(new Vecteur3D(1, Math.PI/2, Math.PI/2 - 0.75*azimut), false);
        context.fillText('a', pt.x - 10, pt.y - 5);
    }
}

//protected void dessinAngleHoraire(final Vecteur B, final boolean devant)
function dessinAngleHoraire(B, devant) {
    if ((devant && H <= Math.PI) || (!devant && H > Math.PI)) {
        context.strokeStyle = couleurAngleH;
        context.fillStyle = couleurAngleH;
        dessinArc(new Vecteur3D(1, Math.PI/2, Math.PI/2), B, false, true, true);
    } else if (devant && H > Math.PI) {
        context.strokeStyle = couleurAngleH;
        context.fillStyle = couleurAngleH;
        dessinArc(new Vecteur3D(1, Math.PI/2, Math.PI/2), new Vecteur3D(1, Math.PI/2, -Math.PI/2), false, true, false);
    }
    if (devant) {
        var pt = conversion(new Vecteur3D(1, Math.PI/2, Math.PI/2 - 0.75 * H), true);
        context.fillText('H', pt.x - 10, pt.y - 5);
    }
}

//protected void dessinAngleHauteur(final Vecteur A, final Vecteur MsphHoz, final boolean devant)
function dessinAngleHauteur(A, MsphHoz, devant) {
    var Adevant = (Math.cos(A.get(2)) > 0);
    if (Adevant == devant) {
        context.strokeStyle = couleurAngleHauteur;
        context.fillStyle = couleurAngleHauteur;
        dessinArc(A, MsphHoz, true, false, true);
        if (Math.abs(MsphHoz.get(1) - Math.PI/2) > 0.1) {
            var pt = conversion(new Vecteur3D(1, Math.PI/2 - (Math.PI/2 - MsphHoz.get(1))/2, A.get(2)), false);
            var x;
            if (delta >= 0)
                x = pt.x - 10;
            else
                x = pt.x + 5;
            context.fillText('h', x, pt.y + 5);
        }
    }
}

// dessin d'un arc entre 2 points dans l'un des 2 systèmes de coordonnées sphériques, en suivant l'une des coordonnées
//protected void dessinArc(final Vecteur v1, final Vecteur v2, final boolean sensPhiPositif, final boolean coordEq, final boolean fleche)
function dessinArc(v1, v2, sensPhiPositif, coordEq, fleche) {
    var nb = Math.floor(precisionCourbes / 4);
    var dr = (v2.get(0) - v1.get(0)) / nb;
    var dtheta = (v2.get(1) - v1.get(1)) / nb;
    var phi1 = v1.get(2);
    var phi2 = v2.get(2);
    if (v1.get(1) == 0)
        phi1 = phi2;
    else if (v2.get(1) == 0)
        phi2 = phi1;
    if (sensPhiPositif && phi1 > phi2)
        phi2 += 2 * Math.PI;
    else if (!sensPhiPositif && phi1 < phi2)
        phi1 += 2 * Math.PI;
    var dphi = (phi2 - phi1) / nb; // ne marche pas toujours (par ex. avec theta = 0)
    context.beginPath();
    var pt = conversion(v1, coordEq);
    var vpt = null;
    context.moveTo(pt.x, pt.y);
    for (var i=1; i<=nb; i++) {
        if (i == nb)
            vpt = pt;
        pt = conversion(new Vecteur3D(v1.get(0) + i * dr, v1.get(1) + i * dtheta, phi1 + i * dphi), coordEq);
        context.lineTo(pt.x, pt.y);
    }
    context.stroke();
    if (fleche && Math.abs(v2.get(0) - v1.get(0)) + Math.abs(v2.get(1) - v1.get(1)) + Math.abs(phi2 - phi1) > 0)
        dessinFleche(vpt, pt);
}

// dessin des 2 traits de la fin de la flêche à partir des 2 derniers points d'un arc
//protected void dessinFleche(final Point2D pt1, final Point2D pt2)
function dessinFleche(pt1, pt2) {
    var l = 6; // longueur des traits en pixels
    var da = Math.PI / 8; // angle des traits avec la fin de l'arc
    var dx = pt2.x - pt1.x;
    var dy = pt2.y - pt1.y;
    var angle;
    if (dx == 0) {
        if (dy > 0)
            angle = Math.PI / 2;
        else
            angle = -Math.PI / 2;
    } else {
        angle = Math.atan(dy / dx);
        if (dx < 0)
            angle = angle + Math.PI;
    }
    var ptFleche = new Point2D(pt2.x - l * Math.cos(angle + da), pt2.y - l * Math.sin(angle + da));
    context.beginPath();
    context.moveTo(pt2.x, pt2.y);
    context.lineTo(ptFleche.x, ptFleche.y);
    context.stroke();
    ptFleche = new Point2D(pt2.x - l * Math.cos(angle - da), pt2.y - l * Math.sin(angle - da));
    context.beginPath();
    context.moveTo(pt2.x, pt2.y);
    context.lineTo(ptFleche.x, ptFleche.y);
    context.stroke();
}

// passage des coordonnées sphériques aux coordonnées écran
//protected Point2D conversion(final Vecteur vsph, final boolean rotEq)
function conversion(vsph, rotEq) {
    // passage aux coordonnées cartésiennes
    var v = vsph.spheriquesVersCartesiennes();

    // rotation optionelle de l'équateur et rotation permettant de voir l'horizon de haut
    if (rotEq)
        v = rotObsEq.produitV(v);
    else
        v = rotObservateur.produitV(v);

    return(projectionEcran(v));
}

// ajout d'un point en coordonnées sphériques (r, theta, phi)
//protected void afficherPoint(final Vecteur vsph, final boolean rotEq, final boolean croix, final String titre)
function afficherPoint(vsph, rotEq, croix, titre) {
    var p = conversion(vsph, rotEq);

    // affichage d'une croix ou d'un point
    if (croix) {
        context.beginPath();
        context.moveTo(p.x - 2, p.y);
        context.lineTo(p.x + 2, p.y);
        context.stroke();
        context.beginPath();
        context.moveTo(p.x, p.y - 2);
        context.lineTo(p.x, p.y + 2);
        context.stroke();
    } else
        context.beginPath();
        context.moveTo(p.x, p.y);
        context.lineTo(p.x, p.y);
        context.stroke();

    // affichage du titre
    if (titre != null) {
        var l = context.measureText(titre).width;
        context.fillText(titre, p.x - l/2, p.y - 9);
    }
}

// projection selon l'axe x à partir des coordonnées cartésiennes, puis conversion vers l'écran
//protected Point2D projectionEcran(final Vecteur v)
function projectionEcran(v) {
    return(new Point2D(cx + v.get(1) * rayon, cy - v.get(2) * rayon));
}

// affichage en heures minutes d'un angle en radians > 0
//protected static String affichageAngleHMS(final double a)
function affichageAngleHMS(a) {
    var h = a*12/Math.PI;
    var ih = Math.floor(h);
    var m = (h - ih)*60;
    var im = Math.round(m);
    if (im >= 60) {
        im -= 60;
        ih += 1;
    }
    return(ih + 'h ' + im + 'm');
}

// affichage en degrés minutes d'un angle en radians
//protected static String affichageAngleDMS(final double a, final boolean estOuest, final boolean angle360)
function affichageAngleDMS(a, estOuest, angle360) {
    var d = Math.toDegrees(Math.abs(a));
    var id = Math.floor(d);
    var m = (d - id)*60;
    var im = Math.round(m);
    if (im >= 60) {
        im -= 60;
        id += 1;
    }
    var signe;
    if (angle360 || a == 0)
        signe = '';
    else if (a > 0)
        signe = '+';
    else
        signe = '-';
    if (estOuest)
        return(id + '° ' + im + "'" + (a >= 0 ? ' E' : ' O'));
    else
        return(signe + id + '° ' + im + "'");
}

//protected static int joursParMois(final int mois, final int an)
function joursParMois(mois, an) {
    switch (mois) {
        case 1: return(31);
        case 2: {
            if (an % 4 == 0 && (an % 100 != 0 || an % 400 == 0))
                return(29);
            else
                return(28);
        }
        case 3: return(31);
        case 4: return(30);
        case 5: return(31);
        case 6: return(30);
        case 7: return(31);
        case 8: return(31);
        case 9: return(30);
        case 10: return(31);
        case 11: return(30);
        case 12: return(31);
    }
    return(0);
}

//protected static int joursParAn(final int an)
function joursParAn(an) {
    if (an % 4 == 0 && (an % 100 != 0 || an % 400 == 0))
        return(366);
    else
        return(365);
}


function Matrice(lignes, colonnes) {
    // m = new double[colonnes][lignes]
    this.m = new Array(colonnes);
    for (var i=0; i<colonnes; i++)
        this.m[i] = new Array(lignes);
    return(this);
}
//public Vecteur produit(final Vecteur v)
Matrice.prototype.produitV = function(v) {
    var nbc = this.m.length;
    var nbl = this.m[0].length;
    if (nbc != v.getDimensions()) {
        alert("produit impossible d'une matrice avec un vecteur (" + nbc + " != " + v.getDimensions() + ")");
        return(null);
    }
    var res = new Vecteur(nbl);
    var d;
    for (var j=0; j<nbl; j++) {
        d = 0;
        for (var i=0; i<nbc; i++)
            d += v.get(i) * this.m[i][j];
        res.set(j, d);
    }
    return(res);
}
//public Matrice produit(final Matrice mat)
Matrice.prototype.produitM = function(mat) {
    var nbc = this.m.length;
    var nbl = this.m[0].length;
    if (nbc != mat.getLignes()) {
        alert("produit impossible d'une matrice avec une matrice (" + nbc + " != " + mat.getLignes() + ")");
        return(null);
    }
    var res = new Matrice(nbl, nbc);
    var d;
    for (var jr=0; jr<nbc; jr++) {
        for (var ir=0; ir<nbl; ir++) {
            d = 0;
            for (var i=0; i<nbc; i++)
                d += this.m[i][jr] * mat.get(ir, i);
            res.set(ir, jr, d);
        }
    }
    return(res);
}
//public int getColonnes()
Matrice.prototype.getColonnes = function() {
    return(this.m.length);
}
//public int getLignes()
Matrice.prototype.getLignes = function() {
    return(this.m[0].length);
}
//public double get(final int colonne, final int ligne)
Matrice.prototype.get = function(colonne, ligne) {
    return(this.m[colonne][ligne]);
}
//public void set(final int colonne, final int ligne, final double valeur)
Matrice.prototype.set = function(colonne, ligne, valeur) {
    this.m[colonne][ligne] = valeur;
}


//public Vecteur(final int dimensions)
function Vecteur(dimensions) {
    // v = new double[dimensions];
    if (typeof(dimensions) == 'undefined')
        this.v = null;
    else
        this.v = new Array(dimensions);
    return(this);
}
//public Vecteur(final double v1, final double v2, final double v3)
Vecteur3D.prototype = new Vecteur();
Vecteur3D.prototype.constructor = Vecteur3D;
function Vecteur3D(v1, v2, v3) {
    Vecteur.call(this, 3);
    this.v = [v1, v2, v3];
    return(this);
}
//public int getDimensions()
Vecteur.prototype.getDimensions = function() {
    return(this.v.length);
}
//public double get(final int pos)
Vecteur.prototype.get = function(pos) {
    return(this.v[pos]);
}
//public void set(final int pos, final double valeur)
Vecteur.prototype.set = function(pos, valeur) {
    this.v[pos] = valeur;
}
// coordonnées sphériques (r, theta, phi) vers cartésiennes (x, y, z)
//public Vecteur spheriquesVersCartesiennes()
Vecteur.prototype.spheriquesVersCartesiennes = function() {
    if (this.v.length != 3) {
        alert("Conversion impossible de coordonnées (" + this.v.length + " != 3)");
        return(null);
    }
    var res = new Vecteur(3);
    res.set(0, this.v[0] * Math.sin(this.v[1]) * Math.cos(this.v[2]));
    res.set(1, this.v[0] * Math.sin(this.v[1]) * Math.sin(this.v[2]));
    res.set(2, this.v[0] * Math.cos(this.v[1]));
    return(res);
}
// coordonnées cartésiennes (x, y, z) vers sphériques (r, theta, phi)
//public Vecteur cartesiennesVersSpheriques()
Vecteur.prototype.cartesiennesVersSpheriques = function() {
    if (this.v.length != 3) {
        System.err.println("Conversion impossible de coordonnées (" + this.v.length + " != 3)");
        return(null);
    }
    var res = new Vecteur(3);
    var r = Math.sqrt(this.v[0]*this.v[0] + this.v[1]*this.v[1] + this.v[2]*this.v[2]);
    res.set(0, r);
    res.set(1, Math.acos(this.v[2]/r));
    if (this.v[0] > 0) // x > 0
        res.set(2, Math.atan(this.v[1]/this.v[0]));
    else if (this.v[0] < 0) // x < 0
        res.set(2, Math.PI + Math.atan(this.v[1]/this.v[0]));
    else if (this.v[1] > 0) // x = 0, y > 0
        res.set(2, Math.PI / 2);
    else if (this.v[1] < 0) // x = 0, y < 0
        res.set(2, 3 * Math.PI / 2);
    else // x = 0, y = 0 : peu importe !
        res.set(2, 0);
    return(res);
}

function Point2D(x, y) {
    this.x = x;
    this.y = y;
}

window.onload=init;

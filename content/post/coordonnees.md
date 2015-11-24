+++
date = "2015-11-24T13:30:00+01:00"
draft = false
title = "Systèmes de coordonnées"
banner = "banners/road.png"
categories = ["General"]
tags = ["coordonnees","reperes","astronomie"]
slug = "coordonnees"
+++

<script type="text/javascript" src="../../../../js/curseur.js"></script>
<script type="text/javascript" src="../../../../js/coordonnees.js"></script>

Le repérage au sol
==================

Même si; la généralisation de l'usage des GPS à familiarisé le grand public avec les systèmes de coordonnées terrestres, il est toujours bon d'en rappeler quelques fondamentaux.
On parle ici de coordonnées géographiques, et tout lieu est identifié dans un système de coordonnées géodésiques ayant trois composantes:

* Latitude (direction Nord / Sud)
* Longitude (direction Ouest / Est)
* Altitude (hauteur du lieu)

Le globe est donc divisé par des lignes géodésiques:

* Les lignes formées à latitudes égales sont dites parallèles
* Les lignes de longitudes équivalentes sont nommées meridiens

![Le globe](https://upload.wikimedia.org/wikipedia/commons/a/ab/WorldMapLongLat-eq-circles-tropics-non.png)

Les origines pour chacune d'elles sont respectivement:

* L'équateur 0° qui divise le globe en 2 hemispheres Nord et Sud. Les latitudes ont des valeurs en dégrés comprises entre -90° à +90°.
* Le premier méridien 0° passe par Observatoire royal de Greenwich et coupe également la France. Les longitudes sont étendue sur les 360° du globle et comprises entre -180° et +180° autour du meridien de Greenwich
* L'altitude est données en mètres à partir du niveau moyen des mers.

Les latitudes et longitudes sont usuellement exprimées dégrés et minutes puis secondes en base sexagésimale.

On note que le globle est découpé par quelques parallèles remarquables:

* Le cercle arctique (66° 33′ 38″ N)
* Le tropique du cancer (23° 26′ 22″ N)
* L'equateur (0° N)
* Le tropique du capricorne (Sagittarius) (23° 26′ 22″ S)
* Le cercle antartique (66° 33′ 38″ S)

Montures et repères
===================

Systèmes de coordonnées astronomiques
=====================================

<span>
      <table class="coord">
        <tr>
          <td colspan="4" style="text-align: center;"><canvas id="dessin"></canvas></td>
        </tr>
        <tr><td colspan="2">Coordonnées azimutales:</td>
          <td colspan="2" style="text-align: center;" id="infos"></td>
        </tr>
        <tr><td colspan="4">Coordonnées équatoriales:</td></tr>
        <tr>
            <td id="valeurAlpha" style="width: 8em"></td>
            <td><canvas id="curseurAlpha" width="180" height="30"></canvas></td>
            <td id="valeurDelta"></td>
            <td><canvas id="curseurDelta" width="180" height="30"></canvas></td>
        </tr>
        <tr><td colspan="4">Coordonnées géographiques:</td></tr>
        <tr>
            <td id="valeurPhi"></td>
            <td><canvas id="curseurPhi" width="180" height="30"></canvas></td>
            <td id="valeurL"></td>
            <td><canvas id="curseurL" width="180" height="30"></canvas></td>
        </tr>
        <tr><td colspan="4">Valeurs temporelles:</td></tr>
        <tr>
            <td id="valeurHeure"></td>
            <td><canvas id="curseurHeure" width="180" height="30"></canvas></td>
            <td id="valeurJour"></td>
            <td><canvas id="curseurJour" width="180" height="30"></canvas></td>
        </tr>
        <tr>
            <td id="valeurMois"></td>
            <td><canvas id="curseurMois" width="180" height="30"></canvas></td>
            <td id="valeurAnnee"></td>
            <td><canvas id="curseurAnnee" width="180" height="30"></canvas></td>
        </tr>
      </table>
</span>

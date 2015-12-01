+++
date = "2015-11-24T13:30:00+01:00"
draft = false
title = "Systèmes de coordonnées"
banner = "banners/circumpolaire.png"
categories = ["General"]
tags = ["coordonnees","reperes","astronomie"]
slug = "coordonnees"
+++

<script type="text/javascript" src="../../../../js/curseur.js"></script>
<script type="text/javascript" src="../../../../js/coordonnees.js"></script>

# Le repérage au sol

Même si, la généralisation de l'usage des GPS a familiarisé le grand public avec les systèmes de coordonnées terrestres, il est toujours bon d'en rappeler quelques fondamentaux. On parle ici de coordonnées géographiques, et tout lieu est identifié dans un système de coordonnées géodésiques ayant trois composantes:

* Latitude (angle Nord / Sud)
* Longitude (angle Ouest / Est)
* Altitude (hauteur du lieu)

Le globe est donc divisé par des lignes géodésiques:

* Les lignes formées à latitudes égales sont dites parallèles</li>
* Les lignes de longitudes équivalentes sont nommées méridiens</li>


![Le globe](https://upload.wikimedia.org/wikipedia/commons/a/ab/WorldMapLongLat-eq-circles-tropics-non.png)

Les origines pour chacune d'elles sont respectivement:

* L'équateur $0°$ qui divise le globe en 2 hemispheres Nord et Sud. Les latitudes ont des valeurs en dégrés comprises entre $\measuredangle \pm 90°$.
* Le premier méridien 0° passe par l'observatoire royal de Greenwich et coupe également la France. Les longitudes sont étendues sur les $360°$ du globle et comprises entre $\measuredangle \pm 180°$ autour du meridien de Greenwich
* L'altitude est donnée en mètres à partir du niveau moyen des mers.

Les latitudes et longitudes sont usuellement exprimées dégrés puis minutes et secondes en base sexagésimale.

Pour exemple les coordonnées de Paris Notre Dame sont:
$$
latitude: 48°51'23,81"\ N\\\\
longitude: 2°21'7,998"\ E
$$

On note que le globle est découpé par quelques parallèles remarquables:

* Le cercle arctique (66° 33′ 38″ N)
* Le tropique du cancer (23° 26′ 22″ N)
* L'equateur (0° N)
* Le tropique du capricorne (Sagittarius) (23° 26′ 22″ S)
* Le cercle antartique (66° 33′ 38″ S)

# Systèmes de coordonnées astronomiques

## Systèmes de références locales

### Coordonnées azimutales

Lorsque l'on regarde le ciel, celui-ci se présente à nous comme une demi sphère au dessus de notre horizon local. Dans ce repère, l'origine est l'observateur et son horizon est désigné par le plan formé par les quatre points cardinaux, la perpendiculaire de ce plan passant par l'origine pointe le zenith du lieu dans le sens opposé à la pesanteur. On note que ce système de coordonnées locales correspond au positionnement des axes d'une monture alt-azimutale.

![Demi Sphere Celeste](../../../../images/coordonnees/demisphere.png)

Dans ce système de coordonnées l'étoile située au point A est repèrée par son azimut `a`, compté en degrés $(0°\rightarrow 360°)$ à partir du point cardinal Sud dans le [sens rétrograde](https://fr.wikipedia.org/wiki/Sens_de_rotation) $\circlearrowright$ et sa hauteur `h`, comprise entre $\measuredangle \pm 90°$.

### Coordonnées horizontales

Par extension, on introduit le système de coordonnées horizontale basée sur le même système mais dont l'origine est située au centre du globe térrestre. L'ensemble des étoiles se retrouvant sur une sphère celeste de rayon quelconque.

![Sphere Celeste](../../../../images/coordonnees/horizontal.png)

Ce système de coordonnées est certainement le plus évident mais il possède quelques défauts majeurs.    
En premier lieu, comme l'axe $Oz$ qui indique la verticale du repère passe par le zenith local, on devine très vite qu'une étoile aura une hauteur variable en fonction du temps puisque l'axe de rotation terrestre est $OP$. On a indiqué sur le schéma ci-dessus la course apparente d'une étoile pendant la nuit. Elle se reprèsente par un mouvement circulaire dans un plan perpendiculaire à l'axe de rotation terrestre dont la direction est indiqué par le pôle P. Ici, $\varphi$ pour Paris est approximativement de $49°$.   
D'autre part, le zenith est local et les coordonnées de l'étoile seront variables en fonction de notre position sur le globe terrestre.

En résumé:
*Dans ce repère, les coordonnées d'une étoile indiquées par l'azimut et la hauteur ne sont valables que pour un lieu et un horaire précis.*

### Coordonnées horaires

En choisissant l'équateur celeste comme plan fondamental, on bascule le repère de coordonnées en fonction de la latitude du lieu. L'axe $Oz$ du repère ne pointe alors plus vers le zenith Z mais vers le pôle celeste P en tout lieu du globe. C'est ce qui est pratiqué pour la mise en place des montures équatoriales.    
Dans le système de coordonnées horaires, on utilise comme origine du cercle horaire le point M situé à l'intersection du plan équatorial et du méridien celeste qui coupe le monde en deux dans la direction Nord Sud en passant par le zenith.  

![Plan Equatorial](../../../../images/coordonnees/horaire.png)

Dans ce système de coordonnées la hauteur des étoiles noté `$\delta$` est fixe dans le temps et ne change pas en fonction du lieu d'observation. Elle se mesure en degrés $\delta = \measuredangle \pm 90°$ à partir de l'équateur celeste.
L'angle horaire `H` est exprimé en heures et fraction sexagesimales de l'heure à partir du méridien celeste dans le sens rétrograde.

Sur un interval de temps court (une nuit), on peux considérer que l'angle horaire varie uniformément par rapport au temps. Cependant, ceci n'est pas valable sur un interval mensuel. On note également que l'angle horaire est dépendant de la position de l'observateur sur le globe car il est lié à la longitude géographique du lieu.

### Changement de coordonnées locales

Les transformations utilisées pour les changements de repères sont basées sur les relations remarquables dans le triangle sphérique et en appliquant les formules de trigonométrie sphérique;  
on démontre:

horizontales $\rightarrow$ horaires:
$$
\begin{alignat}{2}
\begin{cases}
sin (\delta) &= sin (\varphi) \cdot sin (h)\ – cos (\varphi) \cdot cos (h) \cdot cos (a)\\\\
cos (\delta) \cdot cos (H) &= cos (\varphi) \cdot sin (h) + sin (\varphi) \cdot cos (h) \cdot cos(a)\\\\
cos (\delta) \cdot sin (H) &= cos (h) \cdot sin (a)
\end{cases}
\end{alignat}
$$

horaires $\rightarrow$ horizontales:
$$
\begin{alignat}{1}
\begin{cases}
sin (h) &= sin (\varphi) \cdot sin(\delta) + cos(\varphi) \cdot cos(\delta) \cdot cos(H)\\\\
cos (h) \cdot cos (a) &= - cos(\varphi) \cdot sin(\delta) + sin (\varphi) \cdot cos(\delta) \cdot cos(H)\\\\
cos (h) \cdot sin (a) &= cos(\delta) \cdot sin(H)
\end{cases}
\end{alignat}
$$

## Systèmes de références celeste

### Point vernal $\gamma$ et temps sidéral

La course apparente du soleil observée depuis la terre dessine le cercle ecliptique sur la sphère celeste. Le plan écliptique corresponds au plan du système solaire.

![Plan Ecliptique](../../../../images/coordonnees/vernal.png)

Les plans ecliptique et équatorial rentre en intersection et forme la ligne des noeuds. L'intersection des cercles ecliptique et equatorial dessine deux points $\gamma$ et $\gamma\prime$ correspondant respectivement aux equinoxes de printemps et automne. $\gamma$ est dit point vernal. Aux equinoxes, la durée du jour et de la nuit sont égales.

On défini le temp sidéral $T$ comme l'angle horaire du point vernal $\gamma$. Le jour sidéral, défini comme l'intervale entre deux passage du point vernal au méridien du lieu est en première approximation de $23h\ 56m\ 4s$.

Il existe un petite différence de $8,4ms$ entre le jour sidéral et le jour stéllaire qui correspond au passage d'une étoile au même point de la sphere celeste. Cette différence s'explique par différents phenomènes perturbateurs dont le principal est la précession des equinoxes. Nous détaillerons ces éléments dans un prochain article.  

### Coordonnées équatoriales

Un fois le point vernal défini on introduit le système de coordonnées équatorial en remplacant l'angle horaire par l'ascension droite $\alpha$ dans le système de coordonnées horaires. L'ascension droite $\alpha$ est exprimée en heures et comptée positivement dans le sens direct à partir du point vernal $\gamma$.

![Plan Equatorial](../../../../images/coordonnees/equatorial.png)

Le gros avantage du système équatorial est d'avoir des composantes équatoriales $\alpha$ et $\delta$ invariantes dans le temps et quelque soit la position de l'observateur sur le globe. Il s'agit donc du système majoritairement utilisé par les astronomes amateurs.

### Changement de coordonnées

Dans ce système équatorial, on indique la relation entre le temps sidéral, l'angle horaire et ascension droite qui permetra de déduire les relations de transformations pour les changements coordonnées:

$$H = T - \alpha$$

coordonnées equatoriales $\rightarrow$ horaires $\rightarrow$ horizontales

$$
\begin{alignat}{2}
\begin{cases}
sin (h) &= sin (\varphi) \cdot sin (\delta) + cos(\varphi) \cdot cos (\delta) \cdot cos (H)\\\\
cos (h) \cdot sin (\alpha) &= cos δ \cdot sin(H) \\\\
cos (h) \cdot cos (\alpha) &= - cos(\varphi) \cdot sin(\delta) + sin(\varphi) \cdot cos(\delta) \cdot cos (H)
\end{cases}
\end{alignat}
$$

coordonnées horizontales $\rightarrow$ horaires $\rightarrow$ equatoriales

$$
\begin{alignat}{2}
\begin{cases}
sin(\delta) &= sin(\varphi) \cdot sin(h) - cos(\varphi) \cdot cos(h) \cdot cos(\alpha)\\\\
cos(\delta) \cdot sin (H) &= cos(h) \cdot sin(\alpha)\\\\
cos(\delta) \cdot cos (H) &= cos(\varphi) \cdot sin(h) + sin(\varphi) \cdot cos(h) \cdot cos(\alpha)
\end{cases}
\end{alignat}
$$

### Simulateur

En utilisant le simulateur ci-dessous, il est possible de constater les limites des systèmes de coordonnées locales et d'exposer clairement les invariants du système de coordonnées équatoriales.

Plus spécifiquement:

* On remarque qu'en faisant varier la position de l'observateur, valeurs de latitude $\varphi$ ou de longitude $L$, la position de l'étoile est variable dans le système de coordonnées azimutales.
* On remarque qu'en faisant varier le temps ou la position, les coordonnées équatoriales $\alpha$ et $\delta$ de l'étoile sont invariantes.

<span>
      <table class="coord">
        <tr>
          <td colspan="5" style="text-align: center;"><canvas id="dessin"></canvas></td>
        </tr>
        <tr><td colspan="2">Coordonnées horaires et azimutales:</td>
          <td colspan="3" style="text-align: center;" id="infos" height="30"></td>
        </tr>
        <tr><td colspan="5">Coordonnées équatoriales:</td></tr>
        <tr>
            <td id="valeurAlpha" style="width: 8em;"></td>
            <td><canvas id="curseurAlpha" width="160" height="30"></canvas></td>
            <td width="40"></td>
            <td id="valeurDelta" style="width: 8em;"></td>
            <td><canvas id="curseurDelta" width="160" height="30"></canvas></td>
        </tr>
        <tr><td colspan="5">Coordonnées géographiques:</td></tr>
        <tr>
            <td id="valeurPhi"></td>
            <td><canvas id="curseurPhi" width="160" height="30"></canvas></td>
            <td width="40"></td>
            <td id="valeurL"></td>
            <td><canvas id="curseurL" width="160" height="30"></canvas></td>
        </tr>
        <tr><td colspan="5">Valeurs temporelles:</td></tr>
        <tr>
            <td id="valeurHeure"></td>
            <td><canvas id="curseurHeure" width="160" height="30"></canvas></td>
            <td width="40"></td>
            <td id="valeurJour"></td>
            <td><canvas id="curseurJour" width="160" height="30"></canvas></td>
        </tr>
        <tr>
            <td id="valeurMois"></td>
            <td><canvas id="curseurMois" width="160" height="30"></canvas></td>
            <td width="40"></td>
            <td id="valeurAnnee"></td>
            <td><canvas id="curseurAnnee" width="160" height="30"></canvas></td>
        </tr>
      </table>
</span>

### Coordonnées écliptiques

Le système de coordonnées écliptique est principalement utilisé pour le repérage d'objet dans le système solaire;
car la majorité de ces objets gravitent dans le plan écliptique.

![Ecliptique](https://upload.wikimedia.org/wikipedia/commons/8/86/Obliquite_plan_ecliptique.png)

L'angle $\epsilon$ entre les plans formés par l'équateur et l'ecliptique est dit obliquité.

Dans ce système de coordonnées le plan de référence est l'écliptique et on repère l'étoile avec un système équivalent aux coordonnées équatoriales.

![Plan Ecliptique](../../../../images/coordonnees/ecliptique.png)

Ici l'ascension droite $\alpha$, est remplacée sur l'ecliptique par longitude celeste $\lambda$; dont l'origine est également le point vernal $\gamma$.
La déclinaison $\delta$, est remplacée par la latitude celeste et est notée $\beta$.

Pour observer dynamiquement l'ensemble des planètes en mouvement dans le plan ecliptique, on peut aujourd'hui profiter d'un [simulateur orbital](https://mgvez.github.io/jsorrery/) écrit en javascript et basé sur `three.js`.

___
<div>
<small>Crédits:</small>
<small><li>La circumpolaire en banière est une photo de 2010 de Yuichi Takasika</li></small>
<small><li>Le code principal du simulateur est en provenance de l'observatoire de Paris. Projet astrophysique sur mesure</li></small>
</small>
</div>

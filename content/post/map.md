+++
date = "2016-09-20T14:04:00+01:00"
draft = false
title = "Une petite mise au point"
banner = "banners/map.jpg"
categories = ["Hardware"]
tags = ["Astrophotographie","Pratique","Methode","Mesure"]
slug = "map"
+++

# La mise au point

Lors de l'acquisition, un des facteur les plus déterminant dans la qualité des images est la mise au point (map). Un mise au point imparfaite conduisant à des images sans piqué et manquant de détails. On portera donc une attention particulière à ce réglage lors de nos sessions.

Cela peut paraître simple en première lecture, car nous ne rencontrons que très peu d'obstacles lorsque nous réalisons la mise au point lors de photos diurnes. Les dispositifs d'acquisition récents sont pour la plupart dotés d'un lot d'outils automatisant en grande partie la procédure: mesure infrarouge, nombreux collimateurs autofocus simples/doubles/croisés à très forte réactivité.

Malheureusement, les systèmes d'aide à la mise au point présents sur un APN étant destinés à la photo diurne, ils ne sont pas adaptés à l'astrophotographie et par voie de conséquence innopérants lorsque l'on réalise des images de champs stéllaires.

# La zone critique

De plus, contrairement à la photographie diurne, il est inutile de compter sur la profondeur de champ pour élargir la plage de mise au point. En astrophotographie, les paramètres d'acquisition, la focale, le rapport d'ouverture, la taille de capteur sont fixes et ne peuvent être ajustés.

L'unique variable étant la distance entre le système optique et le plan du capteur réglable via une mécanique à crémaillère située sur le porte oculaire et constituant le système de mise au point. Pour ce qui concerne les astrographes la zone critique de mise au point (cfz: critical focus zone) est uniquement dépendante du rapport d'ouverture de l'instrument.

La valeur en microns de cette zone critique est donnée par la formule suivante:
$$
cfz = 2.2 * (F/D)^2
$$

Pour ma lunette FSQ160ED dont le rapport d'ouverture est $ F/D=5 $, j'ai une zone $cfz=55 \mu$
alors qu'avec mon Schmidt Cassegrain à $ F/D=10 $ le système était bien plus tolérant avec une $cfz=220 \mu$ soit $0.22 mm$.

![Zone critique de mise au point](../../../../images/map/cfz.png)

Ceci explique pourquoi la mécanique est tout aussi importante que la qualité optique sur un instrument d'astronomie car le moindre jeu sur le porte oculaire va se faire sentir.

# Motorisation

Etablir la mise au point manuellement avec une tolérance de $55 \mu$ n'est pas une tâche aisée. A chaque ajustement les vibrations transmises par la main à l'instrument fausse la lecture et l'évaluation de la map. Fort heureusement, mes amis ont collecté une bourse pour un anniversaire que je vais pouvoir mettre à profit.

La première étape dans cette quête du meilleur piqué à donc été de motoriser le système de mise au point.
Le cahier des charges est le suivant:

* un moteur pas à pas avec une forte résolution et un couple important
* un système de couplage efficace
* une interface pour le pilotage du moteur

Dans mon cas le moteur choisi est un moteur pas à pas à aimants permanets, unipolaire aliménté en 12 volt de 48 pas par tour et une réduction de 83,33 /1. On a donc une résolution résultante de 4000 pas / tour, ou 8000 demi-pas / tour en sacrifiant un peu de couple.

Le fonctionnement en demi-pas du moteur en fonction du sens du courant appliqué aux bobines est le suivant:

![Fonctionnement du moteur en demi-pas](../../../../images/map/demipas.gif)

Pour le piloter, il est donc nécessaire de produire un train d'impulsions logiques à l'aide d'une éléctronique adaptée. Celle-ci sera responsable de déplacer le porte oculaire de façon précise en amenant le moteur à des positions précises.

![Train d'impulsions logiques](../../../../images/map/impulsions.png)

J'ai choisi pour cela l'interface Pierro-Astro Sky-Center qui offre d'autres avantages pour l'alimentation de dispositifs périphériques comme les résistances chauffantes.

![Interface de pilotage](../../../../images/map/interface.jpg)

Enfin, le moteur pèse un poids non négligeable, il faut donc trouver un système de montage robuste.
Le parfait alignement entre l'axe du moteur et celui du système de mise au point étant difficile à régler, on utilisera un coupleur d'axes possédant un certain degré de liberté car le couple du moteur étant très important, il ne faudrait pas mettre à mal la mécanique du porte oculaire.

![Le coupleur d'axe](../../../../images/map/couple.jpg)

# Paramétrage du moteur

La première étape est de régler les butées logicielles pour que le moteur ne tente pas de déplacer le porte oculaire en dehors de bornes acceptables.

La deuxième étape du paramétrage de ce moteur est de d'évaluer une valeur pour le rattrapage de jeu.
Ce jeu est généralement dû aux engrenages présents dans le système. J'ai fait cette mesure à l'aide d'une étoile artificielle et j'ai pu établir un jeu de 21 pas.

Ces valeurs sont ensuites rentrées dans le logiciel de pilotage du moteur.

![Pilote Ascom](../../../../images/map/ascom-motor.png)

Enfin, en mesurant le déplacement du porte oculaire entre la position minimale 0 et maximum 6700, je trouve les valeurs suivantes:

| Position      | Déplacement en mm | Ecart / position 0  |  Demi pas en $\mu$ |
| ------------- |:-----------------:| :-------------------| :----------------- |
| $0$           | $10.75$           | $NA$                |                    |
| $2000$        | $16.80$           | $6.05$              | $3.025$            |
| $4000$        | $22.85$           | $12.1$              | $3.025$            |
| $6000$        | $28.95$           | $18.2$              | $3.033$            |
| $6700$        | $31.00$           | $20.25$             | $3.022$            |

Pour faire simple, nous allons arrondir à une valeur entière.
Avec ce moteur, j'ai donc une précision de $3 \mu$ par demi-pas.

# Evaluation et métriques

Dans la pratique en astrophotographie, on constate rapidement que la mise au point est difficile à réaliser avec un simple contrôle visuel. Il n'y a effectivement aucun objet assez lumineux dans le champ pour permettre ce réglage et on utilise donc les étoiles pour effectuer cette mise au point. Or, il faut que l'étoile soit très lumineuse pour être visible sur le capteur de l'APN en utilisant la fonction Liveview; et il est rare d'avoir une étoile aussi lumiseuse dans le champ visé.

Pour compliquer la tâche, la turbulence atmosphérique et la diffraction induite par les optiques étalent les étoiles sur l'image selon une distribution gaussienne et il est donc extrêmement difficile d'évaluer la mise au point visuellement.

![Profile d'une étoile](../../../../images/map/star_profile.png)

Une des méthodes visuelle est d'intercaler un masque de bahtinov dans la chaîne optique. L'idée principale est d'utiliser les aigrettes générées par le masque et de les aligner pour affiner la mise au point. La mise au point étant bonne lorsque l'on obtient une symétrie parfaite des aigrettes.

![Simulation aigrettes bahtinov](../../../../images/map/bahtinov.gif)

Cette méthode est à mon humble avis suffisante pour des instruments dont l'ouverture est supérieur à $F/D=6.5$ mais est trop imprécise pour des lunettes dont le rapport $F/D$ est plus court. Une des explications étant que l'obstruction induite par le masque n'est pas sans effet sur la zone critique de mise au point $cfz$ que nous avons introduite précédement.

## La largeur à mi-hauteur

Pour travailler de façon plus précise, j'utilise donc une méthode qui se base sur l'étude du profil des étoiles.  Effectivement, la largeur à mi-hauteur (ou FWHM: Full Width at Half Maximum) est une métrique utile dans l'évaluation de la mise au point. Comme nos étoiles ont un étalement de type gaussien:

La fonction à la forme suivante:
$$ \DeclareMathOperator{\e}{e} f = \frac{1}{\sigma \sqrt{2 \pi}} \e^{-\frac{(x-\mu)^2}{2\sigma^2}} $$

et on sait calculer la FWHM:
$$ fwhm = 2 \sigma \sqrt{2 \ln(2)} $$

![La métrique FWHM](../../../../images/map/fwhm.png)

Pour plus de rigeur, nous détaillerons dans un autre article les différents types de profils d'étoiles, et nous considérerons ici que la gaussienne reste une bonne approximation pour le caclcul de la FWMH.

L'inconvénient de cette métrique est qu'elle est variable en fonction de la turbulence. La valeur $\sigma$ et l'étalement des étoiles sur l'image étant corrélée à la turbulence atmosphérique.

Pour contourner cette problématique, on peut tenter de faire des pauses plus courtes (donc moins dépendantes de la turbulence) et multiplier le nombre de mesures sur la même étoile afin d'obtenir une moyenne correspondant aux conditions locales de turbulence. On comprend qu'il va falloir multiplier le nombre de pauses pour obtenir un résultat probant.

Ma stratégie est d'intégrer la mesure de plusieurs étoiles non saturées au voisinage du centre du champs photographié et d'établir une valeur moyenne de cette métrique. Cette mesure est un bon indicateur de la mise au point, il n'y a plus qu'à trouver une méthode pour minimiser cette valeur afin d'obtenir le meilleur piqué.

# Mode opératoire

Dans la pratique, j'effectue une première mise au point grossière à l'aide d'un masque de bahtinov ce qui me donne une valeur en nombre de pas. Pour l"exemple nous prendrons une valeur de 3750 pas.
Une fois cette première mesure effectuée, je prends une série de 9 photos de 30 secondes en décalant la mise au point de 20 pas entre chaque pause autour de la valeur en pas précédemment établie.

Soit: 9 photos en partant de la position 3670 en allant jusqu'à la position 3830 par pas de 20 unités

Je calcule ensuite la FWHM moyenne au voisinage du centre sur ces 9 photos et je graphe ces valeurs sur une courbe. La résultante est une coubre en V qui m'indique la meilleure valeur en pas pour la mise au point de l'instrument.

![Courbe FWHM](../../../../images/map/plot.png)

Et finalement, dans le cas présent, je vois que la mise au point au bahtinov n'était pas aussi mauvaise, mais ce n'est pas toujours le cas.

De toute façon, j'applique maintenant la même méthodologie pour surveiller la FWHM pendant l'acquisition des images. Je surveille la lente dérive de la mise au point due à la contraction des matériaux accompagnant la chute de la température pendant la nuit.
Je sais donc quand il est nécessaire de ré-itérer ma procédure de mise au point.


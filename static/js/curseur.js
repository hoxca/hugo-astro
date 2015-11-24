/*
  idCanvas : id de l'élément canvas sur lequel le curseur doit être affiché
  min : valeur minimale
  max : valeur maximale
  defaut : valeur par défaut
  nbpas : nombre de pas du curseur
  log : true pour une progression exponentielle
  modif_fct : fonction appelée quand la valeur est modifié, avec en paramètre un évènement ayant la propriété target
 */
function Curseur(idCanvas, min, max, defaut, nbpas, log, modif_fct) {
    this.canvas = document.getElementById(idCanvas);
    this.longueur = this.canvas.width;
    this.hauteur = this.canvas.height;
    this.min = min;
    this.max = max;
    this.valeur = defaut;
    this.nbpas = nbpas; // nombre de valeurs sélectionnables entre min et max
    this.log = log;
    this.modif_fct = modif_fct; // fonction appelée quand la valeur est modifiée
    this.deplacement = false;
    this.largeur_bouton = 10;
    this.margex = 20;
    this.margey = 4;
    this.hauteur_barre = this.hauteur / 2 - this.margey;
    
    var moi = this;
    this.mousedownProxy = function(e) { moi.mousedown(e) };
    this.mousemoveProxy = function(e) { moi.mousemove(e) };
    this.mouseupProxy = function(e) { moi.mouseup(e) };
    if (this.canvas.addEventListener)
        this.canvas.addEventListener('mousedown', this.mousedownProxy, false);
    else
        this.canvas.attachEvent('onmousedown', this.mousedownProxy);
    if ('ontouchstart' in document)
        this.canvas.addEventListener('touchstart', this.mousedownProxy, false);
    
    this.afficher();
    
    return(this);
}

Curseur.prototype = {
    afficher : function() {
        var context = this.canvas.getContext('2d');
        context.save();
        context.font = '12px sans-serif'
        this.margex = Math.max(context.measureText('' + this.min).width, context.measureText('' + this.max).width) / 2; // context n'est pas disponible avant
        context.fillStyle = 'white';
        context.fillRect(0, 0, this.longueur, this.hauteur);
        
        context.translate(this.margex, this.margey);
        context.fillStyle = 'gray';
        var longueur_barre = this.longueur - 2*this.margex;
        context.fillRect(0, this.hauteur_barre / 2 - 2, longueur_barre, 4);
        
        var xv;
        if (this.log)
            xv = longueur_barre * this.invLogPos(this.valeur);
        else
            xv = longueur_barre * (this.valeur - this.min)/(this.max - this.min);
        if (this.deplacement) {
            context.shadowColor = 'green';
            context.shadowBlur = 3;
        }
        context.fillStyle = '#D0D0D0';
        context.strokeStyle = '#505050';
        context.beginPath();
        context.moveTo(xv - this.largeur_bouton/2, 0);
        context.lineTo(xv + this.largeur_bouton/2, 0);
        context.lineTo(xv + this.largeur_bouton/2, this.hauteur_barre * 2/3);
        context.lineTo(xv, this.hauteur_barre);
        context.lineTo(xv - this.largeur_bouton/2, this.hauteur_barre * 2/3);
        context.closePath();
        context.fill();
        context.stroke();
        context.shadowColor = 'white'; // nécessaire à cause d'un bug de Safari ?
        context.shadowBlur = 0;
        
        context.fillStyle = 'black';
        context.textAlign = 'center';
        context.strokeStyle = 'gray';
        context.textBaseline = 'bottom';
        var longueur_traits = this.hauteur - this.margey - this.hauteur_barre - 13;
        
        var xg = 0;
        context.beginPath();
        context.moveTo(xg, this.hauteur_barre + 1);
        context.lineTo(xg, this.hauteur_barre + longueur_traits);
        context.fillText(this.min, xg, this.hauteur - this.margey);
        
        if ((this.nbpas - 1) % 2 == 0) {
            xg = longueur_barre / 2;
            context.moveTo(xg, this.hauteur_barre + 1);
            context.lineTo(xg, this.hauteur_barre + longueur_traits);
            var v;
            if (this.log)
                v = this.logPos(0.5);
            else
                v = this.min + (this.max - this.min)/2;
            context.fillText((new Number(v)).toFixed(0), xg, this.hauteur - this.margey);
        }
        
        xg = longueur_barre;
        context.moveTo(xg, this.hauteur_barre + 1);
        context.lineTo(xg, this.hauteur_barre + longueur_traits);
        context.fillText(this.max, xg, this.hauteur - this.margey);
        
        if (this.nbpas < longueur_barre/4) {
            for (var i=1; i<this.nbpas-1; i++) {
                if (i != Math.round((this.nbpas - 1) / 2) || (this.nbpas - 1) % 2 != 0) {
                    context.moveTo(i * longueur_barre / (this.nbpas - 1), this.hauteur_barre + 1);
                    context.lineTo(i * longueur_barre / (this.nbpas - 1), this.hauteur_barre + longueur_traits / 2);
                }
            }
        }
        context.stroke();
        
        //context.translate(-this.margex, -this.margey); // inutile avec le restore après
        context.restore();
    },
    getValeur : function() {
        return(this.valeur);
    },
    setMaximum : function(maximum) {
        this.max = maximum;
        if (this.valeur > this.max)
            this.valeur = this.max;
    },
    setNbpas : function(nbpas) {
        this.nbpas = nbpas;
    },
    logPos : function(x) {
        return(Math.pow(10, Math.log(this.min)/Math.log(10) + (Math.log(this.max/this.min)/Math.log(10)) * x));
    },
    invLogPos : function(x) {
        return((Math.log(x)/Math.log(10) - Math.log(this.min)/Math.log(10)) / (Math.log(this.max/this.min)/Math.log(10)));
    },
    coordonnees : function(e) {
        var x, y;
        if (e.pageX || e.pageY) {
          x = e.pageX;
          y = e.pageY;
        } else {
          x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
          y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        var totalOffsetX = 0;
        var totalOffsetY = 0;
        var currentElement = this.canvas;
        do {
            totalOffsetX += currentElement.offsetLeft;
            totalOffsetY += currentElement.offsetTop;
        } while (currentElement = currentElement.offsetParent)
        x -= totalOffsetX;
        y -= totalOffsetY;
        return( { x : x, y : y } );
    },
    mousedown : function(e) {
        this.deplacement = true;
        this.mousemove(e);
        if (this.canvas.addEventListener) {
            document.addEventListener('mousemove', this.mousemoveProxy, false);
            document.addEventListener('mouseup', this.mouseupProxy, false);
        } else {
            document.attachEvent('onmousemove', this.mousemoveProxy);
            document.attachEvent('onmouseup', this.mouseupProxy);
        }
        if ('ontouchstart' in document) {
            document.addEventListener('touchmove', this.mousemoveProxy, false);
            document.addEventListener('touchend', this.mouseupProxy, false);
        }
        if (e.preventDefault)
            e.preventDefault();
        else
            e.returnValue = false;
    },
    mousemove : function(e) {
        var pt = this.coordonnees(e);
        if (this.deplacement) {
            var vvaleur = this.valeur;
            if (pt.x < this.margex)
                this.valeur = this.min;
            else if (pt.x > this.longueur - this.margex)
                this.valeur = this.max;
            else if (this.log) {
                var ratio = (pt.x - 0 - this.margex) / (this.longueur - 2*this.margex);
                ratio = Math.round(ratio * (this.nbpas - 1)) / (this.nbpas - 1);
                this.valeur = this.logPos(ratio);
            } else {
                var ratio = (pt.x - 0 - this.margex) / (this.longueur - 2*this.margex);
                ratio = Math.round(ratio * (this.nbpas - 1)) / (this.nbpas - 1);
                this.valeur = this.min + (this.max - this.min) * ratio;
            }
            this.afficher();
            if (this.valeur != vvaleur)
                this.modif_fct({target: this.canvas});
        }
    },
    mouseup : function(e) {
        this.deplacement = false;
        this.afficher();
        if (this.canvas.addEventListener) {
            document.removeEventListener('mousemove', this.mousemoveProxy, false);
            document.removeEventListener('mouseup', this.mouseupProxy, false);
        } else {
            document.detachEvent('onmousemove', this.mousemoveProxy);
            document.detachEvent('onmouseup', this.mouseupProxy);
        }
        if ('ontouchstart' in document) {
            document.removeEventListener('touchmove', this.mousemoveProxy, false);
            document.removeEventListener('touchend', this.mouseupProxy, false);
        }
    }
}

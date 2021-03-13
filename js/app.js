const appCode = {

      data() {
        return {
          cartes:[],
          cartesVous:[],
          cartesBanque:[], 
          mise : 0,
          reserveVous: 100,
          flag : false,
          revealBanque : false, 
          revealVous : false,
          revealResult : false, 
          resultat : "",

        }
      },

      created() {
        var self=this
        $.getJSON('js/cartes.json', function (data) {
          self.cartes = data
          // console.log(self.cartes)
          var distribution=self.distribuer(self.cartes);
          self.cartesVous= distribution[0];
          self.cartesBanque= distribution[1];
          self.cartes= distribution[2];
        })
        
      },

      computed : {
        scoreVous: function () {
         somme=0;
         this.cartesVous.forEach(function(element){

          if(element.valeur==11){
                  			//on tombe sur un as
                  			if(somme<11){
                  				somme += element.valeur
                  			}else{
                  				somme+=1
                  			}
                  		}else{
                  			somme += element.valeur
                  		}

                  	})

         return somme

       },

       scoreBanque: function () {
         somme=0;
         this.cartesBanque.forEach(function(element){

          if(element.valeur==11){
                  			//on tombe sur un as
                  			if(somme<11){
                  				somme += element.valeur
                  			}else{
                  				somme+=1
                  			}
                  		}else{
                  			somme += element.valeur
                  		}
                  		
                  	})

         return somme

       }

              },//fin computed

              methods: {

                distribuer: function(paquet){
                 function shuffle(array) {
                  array.sort(() => Math.random() - 0.5);
                }


                /*On le mélange 3 fois*/
                for(i=0; i<=3; i++){
                 shuffle(paquet);

               }


                //On tire les 2 cartes du joueur
    var cartesVous = new Array();

    for(i=0; i<=1; i++){
      cartesVous.push(paquet[i]);

    }


    //console.log(cartesVous);

    paquet.splice(0, 2); //on suppr les 2 cartes qui viennent d'être tirées



    //On tire les 2 cartes de la banque
    var cartesBanque = new Array();

    for(i=0; i<=1; i++){
      cartesBanque.push(paquet[i]);
    }
    cartesBanque.sort();
    

    paquet.splice(0, 2); //on suppr les 2 cartes qui viennent d'être tirées

    var cartesDepart = new Array();
    cartesDepart.push(cartesVous);
    cartesDepart.push(cartesBanque);
    cartesDepart.push(paquet);
    return cartesDepart;
  },

  piocher: function(){

    this.cartesVous.push(
      this.cartes[0]
      ) 

    var nouvelleCarte = this.cartes[0];
    console.log(this.cartes);

    this.cartes.splice(0, 1);


  },

  valideMise: function(){
   this.reserveVous -= this.mise
   if(this.reserveVous == 0){
    $('#reserve-vous').attr('style', 'color: red');
  }



  $('#miserplus').hide();
  $('#misermoins').hide();



  this.flag = true;

  this.revealVous = true;
  console.log(this.cartes)
},

terminer: function(){


 this.revealBanque = true;
 var self = this;


 var myvar= setInterval(function(){
   if(self.scoreBanque<17){
    self.cartesBanque.push(self.cartes[0]);
    self.cartes.splice(0, 1);
    console.log(self.scoreBanque);
  }else{
    console.log('fini')
    clearInterval(myvar);

    if(self.scoreBanque > 21){
      self.resultat = 'La banque a sauté, vous gagnez ! Vous remportez '+self.mise*2+' jetons.'
      setTimeout(function(){
        self.reserveVous += self.mise*2;
      }, 300)
      $('#reserve-vous').attr('style', 'color: white');

    }else if(self.scoreVous > self.scoreBanque && self.scoreBanque <= 21){

      self.resultat = 'Vous avez fait mieux que la banque, c\'est gagné ! Vous remportez '+self.mise*2+' jetons.';
      setTimeout(function(){
        self.reserveVous += self.mise*2;
      }, 300)

      $('#reserve-vous').attr('style', 'color: white');

    }else if(self.scoreVous < self.scoreBanque && self.scoreBanque <= 21){

      self.resultat = 'La banque a fait mieux que vous. Vous perdez '+self.mise+' jetons.';

    }else if(self.scoreVous == self.scoreBanque){

      self.resultat = 'Égalité. Vous reprenez vos jetons.';
      setTimeout(function(){
        self.reserveVous += self.mise;
      }, 300)

      $('#reserve-vous').attr('style', 'color: white');
    }

    self.revealResult = true;
    setTimeout(function(){

      self.mise=0;
    }, 300)



  }

},1000)

},

recommencer: function(){

 var self=this;
 this.mise=0;
 if(self.cartes.length<=15){
  $.getJSON('cartes.json', function (data) {
    self.cartes = data
          // console.log(self.cartes)
          var distribution=self.distribuer(self.cartes);
          self.cartesVous= distribution[0];
          self.cartesBanque= distribution[1];
          self.cartes= distribution[2];
        })
   }else{
                    var distribution=self.distribuer(self.cartes); //on redistribue avec des cartes en moins à chaque fois
                  //on met à jour les variabales du data return
                  this.cartesVous= distribution[0];
                  this.cartesBanque = distribution[1];
                  this.cartes = distribution[2];


                  console.log(self.cartes);
                }

                this.flag=false;
                this.revealBanque = false;
                this.revealVous = false;

                this.revealResult = false;

                $('#miserplus').show();


              }


              }, //fin methods


            };

            myApp = Vue.createApp(appCode)
            myApp.mount('#content')

            //FIN APP
            
            //Les règles du jeu
			//obligé de faire en Jquery car v-model non dispo sur les balises button
      var click= false
      $('#infos').click(function(){
       if(click == false){
        $('#regles').show();
        $('#regles').css('animation', 'fadein 0.3s')

      }else{

        $('#regles').css('animation', 'fadeout 0.3s')
        setTimeout(function(){
         $('#regles').hide();
       },200)


      }
      click =! click;
    })
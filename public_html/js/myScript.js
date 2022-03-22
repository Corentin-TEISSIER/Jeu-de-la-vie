const cellSize = 20
const size = 30

const life = {
    board: new Array(),
    borderX: function(){
      return ((paper.view.size.width - size * cellSize) / 2);
    },
    borderY: function(){
      return ((paper.view.size.height - size * cellSize) / 2);
    },
    coords: function(i,j){
      let coordonnees = [this.borderX() + i*cellSize,this.borderY() + j*cellSize];
      return coordonnees;
    },
    init: function(){ //fonction d'initialisation du tableau de cellule (tableau double dimension, chaque case comporte une cellule)
      for (let i=0; i<size; i++){
        this.board[i]= new Array();
        for (let j=0; j<size; j++){
          this.board[i][j]=new Cell(i,j+1);
        }
      }
    },
    saveState: function(){ //Sauvegarde de l'état courant dans l'état précédent pour passer à l'état suivant
      for(let i=0;i<size;i++){
        for(let j=0;j<size;j++){
          this.board[i][j].setPreviousState(this.board[i][j].getState());
        }
      }
    },
    getPreviousState: function(i,j){
      if((i>=0) && (i<size) && (j>=0) && (j<size)){
        return this.board[i][j].getPrevState();
      }
      else{
        return 0;
      }
    },
    nbVoisin: function(i,j){ //fonction permettant de calculer le nombre de voisin vivant d'une cellule de coordonnées i, j
      let nbVoisin=0;
      for(let k=-1;k<=1;k++){
        for(let l=-1;l<=1;l++){
          nbVoisin =nbVoisin + this.getPreviousState(i+k,j+l);
        }
      }
      nbVoisin = nbVoisin - this.getPreviousState(i,j);
      return(nbVoisin);
    },
    iterate: function() { //fonction qui avance de un pas la simulation
      this.saveState();

      let nbVoisinVivant=0;
      //on met l'etat courant à jour cellule apres cellule en fonction de son environnement precedent
      for(let i=0; i<size; i++){
        for(let j=0; j<size; j++){

          nbVoisinVivant=this.nbVoisin(i,j);

          if((this.getPreviousState(i,j)===0) && (nbVoisinVivant===3)){
            this.board[i][j].setState(1);
            this.board[i][j].live();
          }
          if(this.getPreviousState(i,j)===1){
            if((nbVoisinVivant===2)||(nbVoisinVivant===3)){
              this.board[i][j].live();
            }
            else{
              this.board[i][j].die();
            }
          }

          //console.log("("+i+","+j+"): state => "+this.board[i][j].getState()+" / prev => "+this.board[i][j].getPrevState());

        }
      }
    }
}

class Cell {
  #i;
  #j;
  #state=0;
  #previousState=0;
  #shape;

  constructor(i,j){
    this.#i=i;
    this.#j=j;
    this.#state=0;
    this.#previousState=0;
    this.#shape=paper.Path.Circle({center:life.coords(this.#i,this.#j),
                                   radius:cellSize/2,
                                   fillColor:'white',
                                   strokeColor:'blue'});

  }

  getState(){
    return(this.#state);
  }

  setState(i){
    this.#state=i;
  }

  setPreviousState(i){
    this.#previousState=i;
  }


  getPrevState(){
    return(this.#previousState);
  }

  //fonction permettant derendre une cellule vivante ou morte:

  live(){
    this.setState(1);
    this.#shape=paper.Path.Circle({center:life.coords(this.#i,this.#j),
                                   radius:cellSize/2,
                                   fillColor:'cyan',
                                   strokeColor:'blue'});
  }

  die(){
    this.setState(0);
    this.#shape=paper.Path.Circle({center:life.coords(this.#i,this.#j),
                                   radius:cellSize/2,
                                   fillColor:'white',
                                   strokeColor:'blue'});
  }

}


// avancer la sumulation d'un pas par appui sur touche g du clavier
function onKeyUp(event){
  if (event.key =='g') {
    console.log("Step");
    life.iterate();
  }
}

// avancement de la simulation automatique
function onFrame(){
  console.log("Step");
  life.iterate();
}

window.addEventListener("keyup",onKeyUp);

window.addEventListener("load",
    function(){
        let canvas = document.getElementById("myCanvas")
        paper.setup(canvas)

        //test creation cellule
        // let cell1 = new Cell(1,1);
        life.init();

        life.board[5][4].live();
        life.board[5][5].live();
        life.board[5][6].live();
        life.board[5][7].live();
        life.board[5][8].live();

        life.board[9][4].live();
        life.board[9][5].live();
        life.board[9][6].live();
        life.board[9][7].live();
        life.board[9][8].live();

        life.board[7][8].live();
        life.board[7][4].live();

        //simulation pas a pas avec appui de g
        // document.addEventListener('keyup',onKeyUp,false);

        //simulation à 60 pas par seconde
        paper.view.setOnFrame(onFrame)







        // Placer le code à exécuter ici pour qu'il le soit une fois la page
        // chargée dans son intégralité
    }
)

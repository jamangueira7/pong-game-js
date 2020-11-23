var initial;
var bowl;
var cpu;
var player;
var txtPlayerPoints;
var txtCPUPoints;

var frames;

var posBowlX, posBowlY;
var posPlayerX, posPlayerY, posCpuX, posCpuY;

var dirYPlayer;
var posBowlInitalX=475;
var posBowlInitalY=240;
var posPlayerInitalY=180;
var posPlayerInitalX=10;
var posCpuInitalY=180;
var posCpuInitalX=930;

var fieldWidth=960, fieldHeight=500;
var barWidth=20, barHeight=140;
var bowlWidth=20, bowlHeight=20;

var bowlX, bowlY;
var velocityBowl, velocityCpu, velocityPlayer;

var pointsPlayer=0;
var pointsCPU=0;
var key;
var game=false;

function playerControl() {
    if(game) {
        posPlayerY+=velocityPlayer*dirYPlayer;
        if(((posPlayerY+barHeight) >= fieldHeight) || (posPlayerY <= 0)) {
            posPlayerY+=(velocityPlayer*dirYPlayer)*(-1);
        }
        player.style.top= posPlayerY+"px";
    }
}

function cpuControl() {
    if(game) {
        if(posBowlX > (fieldWidth/2) && bowlX > 0) {
            //Mover para baixo
            if(posBowlY + (bowlHeight/2) > (posCpuY + (barHeight/2)) + velocityCpu) {
                if(posCpuY + barHeight <= fieldHeight) {
                    posCpuY+=velocityCpu;
                }
            }else if((posBowlY + (bowlHeight/2)) < (posCpuY + (barHeight/2)) - velocityCpu) {
                //Mover para cima
                if(posCpuY >= 0) {
                    posCpuY-=velocityCpu;
                }
            }
        }else {
            //Posicionar CPU no meio apos mexer
            if(posCpuY+(barHeight/2) < (fieldHeight/2)) {
                posCpuY+=velocityCpu;
            }else if(posCpuY+(barHeight/2) > (fieldHeight/2)) {
                posCpuY-=velocityCpu;
            }
        }
        cpu.style.top= posCpuY+"px";
    }
}

function bowlControl() {
    posBowlX+=velocityBowl*bowlX;
    posBowlY+=velocityBowl*bowlY;

    //colisão com jogador
    if((posBowlX <= posPlayerX + barWidth) &&
        ((posBowlY+bowlHeight >= posPlayerY) && (posBowlY <= posPlayerY + barHeight))
    ) {
        bowlY=((posBowlY+(bowlHeight/2))-(posPlayerY+(barHeight/2)))/16;
        bowlX*=-1;
    }

    //colisão com CPU
    if((posBowlX >= posCpuX - barWidth) &&
        ((posBowlY+bowlHeight >= posCpuY) && (posBowlY <= posCpuY + barHeight))
    ) {
        bowlY=((posBowlY+(bowlHeight/2))-(posCpuY+(barHeight/2)))/16;
        bowlX*=-1;
    }

    //Limite superior e inferior
    if(posBowlY >= 480 || posBowlY <= 0) {
        bowlY*=-1;
    }

    //Pontuação
    if(posBowlX >= (fieldWidth - bowlWidth)) {
        velocityBowl=0;

        pointsPlayer++;
        txtPlayerPoints.innerText = pointsPlayer;
        initialGame(false);
    }else if(posBowlX  <= 0){
        velocityBowl=0;
        pointsCPU++;
        txtCPUPoints.innerText = pointsCPU;
        initialGame(false);
    }

    bowl.style.top=posBowlY+"px";
    bowl.style.left=posBowlX+"px";
}

function down() {
    key=event.keyCode;
    if(key==38) {
        dirYPlayer=-1;
    }else if(key==40){
        dirYPlayer=+1;
    }
}

function up() {
    key=event.keyCode;
    if(key==38) {
        dirYPlayer=0;
    }else if(key==40){
        dirYPlayer=0;
    }
}

function gameControl() {
    if(game) {
        playerControl();
        bowlControl();
        cpuControl();
        checkWinner()
    }
    frames=requestAnimationFrame(gameControl);
}

function checkWinner() {
    if(pointsPlayer >=5) {
        initialGame(false);
        alert(`Jogador ganhou por ${pointsCPU} x ${pointsPlayer}`);
        pointsCPU=0;
        pointsPlayer=0;
        txtCPUPoints.innerText = pointsCPU;
        txtPlayerPoints.innerText = pointsPlayer;
    }
    if(pointsCPU >= 5) {
        initialGame(false);

        alert(`CPU ganhou por ${pointsCPU} x ${pointsPlayer}`);
        pointsCPU=0;
        pointsPlayer=0;
        txtCPUPoints.innerText = pointsCPU;
        txtPlayerPoints.innerText = pointsPlayer;
    }
}

function startGame() {
    if(!game) {
        velocityBowl=velocityCpu=velocityPlayer=8;
        cancelAnimationFrame(frames);
        dirYPlayer=0;
        bowlY=0;
        if((Math.random()*10) < 5) {
            bowlX=-1;
        }else {
            bowlX=1;
        }
        initialGame(true);
        gameControl();
    }

}

function initialGame(gameTrue) {
    posBowlX = posBowlInitalX;
    posBowlY = posBowlInitalY;
    posPlayerY=posPlayerInitalY;
    posPlayerX = posPlayerInitalX;
    posCpuX = posCpuInitalX;
    posCpuY=posCpuInitalY;
    game=gameTrue;
    player.style.top= posPlayerY+"px";
    cpu.style.top= posPlayerY+"px";
}

function initialize() {
    velocityBowl=velocityCpu=velocityPlayer=8;
    initial = document.getElementById('btInitial');
    initial.addEventListener("click", startGame);

    bowl = document.getElementById('dvBowl');
    cpu = document.getElementById('dvCpu');
    player = document.getElementById('dvPlayer');

    txtPlayerPoints = document.getElementById('txtPlayer');
    txtCPUPoints = document.getElementById('txtCPU');

    document.addEventListener("keydown", down);
    document.addEventListener("keyup", up);
}

window.addEventListener('load', initialize);

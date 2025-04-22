window.startBreakout = function (dotNet, canvasId) {
    const c = document.getElementById(canvasId);
    const ctx = c.getContext('2d');
    let waitingAck = false;

    function drawOnce() {
        return dotNet.invokeMethodAsync('UpdateFrame').then(data => {
            // fundo
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, c.width, c.height);

            // bola
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(data.ballX + data.ballR, data.ballY + data.ballR, data.ballR, 0, 2 * Math.PI);
            ctx.fill();

            // paddle
            ctx.fillStyle = 'red';
            ctx.fillRect(data.paddleX, data.paddleY, data.paddleW, data.paddleH);

            // chão
            ctx.strokeStyle = 'yellow'; ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, c.height - 2);
            ctx.lineTo(c.width, c.height - 2);
            ctx.stroke();

            // HUD
            ctx.fillStyle = 'white';
            ctx.font = '16px sans-serif';
            ctx.fillText(`Score: ${data.score}`, 10, 20);
            ctx.fillText(`Tempo: ${data.elapsed}s`, 10, 40);

            if (data.pause) {
                if (data.isDeath) {
                    // GAME OVER
                    ctx.fillStyle = 'rgba(0,0,0,0.7)';
                    ctx.fillRect(0, 0, c.width, c.height);

                    ctx.fillStyle = 'white';
                    ctx.font = '24px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText('GAME OVER', c.width / 2, c.height / 2 - 40);
                    ctx.font = '18px sans-serif';
                    ctx.fillText(`Pontos: ${data.lastScore}`, c.width / 2, c.height / 2);
                    ctx.fillText(`ID: ${data.sessionId}`, c.width / 2, c.height / 2 + 30);
                    ctx.font = '14px sans-serif';
                    ctx.fillText('Clique ou Space para reiniciar', c.width / 2, c.height / 2 + 60);

                    if (!waitingAck) attachRestart();
                } else {
                    // PAUSE
                    ctx.fillStyle = 'rgba(0,0,0,0.5)';
                    ctx.fillRect(0, 0, c.width, c.height);
                    ctx.fillStyle = 'white';
                    ctx.font = '24px sans-serif'; ctx.textAlign = 'center';
                    ctx.fillText('PAUSE', c.width / 2, c.height / 2);
                    ctx.font = '14px sans-serif';
                    ctx.fillText('Backspace para continuar', c.width / 2, c.height / 2 + 30);
                }
            }
        });
    }

    function attachRestart() {
        waitingAck = true;
        function restart() {
            c.removeEventListener('click', restart);
            window.removeEventListener('keydown', onKey);
            dotNet.invokeMethodAsync('ResetGame').then(() => waitingAck = false);
        }
        function onKey(e) { if (e.code === 'Space') restart(); }
        c.addEventListener('click', restart);
        window.addEventListener('keydown', onKey);
    }

    function loop() {
        drawOnce().then(() => requestAnimationFrame(loop));
    }
    loop();
};

window.registerKeyHandlers = function (dotNet) {
    window.addEventListener('keydown', e => {
        if (e.code === 'ArrowLeft') {
            dotNet.invokeMethodAsync('KeyDown', -1);
        }
        else if (e.code === 'ArrowRight') {
            // estava KeyUp, agora corrigido para KeyDown
            dotNet.invokeMethodAsync('KeyDown', 1);
        }
        else if (e.code === 'Backspace') {
            dotNet.invokeMethodAsync('TogglePause');
        }
    });

    window.addEventListener('keyup', e => {
        if (e.code === 'ArrowLeft') {
            dotNet.invokeMethodAsync('KeyUp', -1);
        }
        else if (e.code === 'ArrowRight') {
            dotNet.invokeMethodAsync('KeyUp', 1);
        }
    });
};


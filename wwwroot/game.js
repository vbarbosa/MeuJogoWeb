window.startBreakout = function (dotNet, canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');


    let paused = false;   // loop travado
    let waitingAck = false;   // aguardando clique / space para retomar

    /* ---------- helpers ---------- */
    function drawPauseScreen() {
        // fundo semitransparente em cima do jogo
        ctx.fillStyle = 'rgba(0,0,0,.65)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // caixa de mensagem
        const w = 300, h = 120;
        const x = (canvas.width - w) / 2;
        const y = (canvas.height - h) / 2;

        ctx.fillStyle = '#222';
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = '#555';
        ctx.strokeRect(x, y, w, h);

        ctx.fillStyle = '#fff';
        ctx.font = '18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('A bolinha caiu!', x + w / 2, y + 40);
        ctx.font = '14px sans-serif';
        ctx.fillText('Clique ou pressione Espaço para continuar', x + w / 2, y + 70);
    }

    function attachResumeHandlers() {
        waitingAck = true;
        function resume() {
            canvas.removeEventListener('click', resume);
            window.removeEventListener('keydown', resumeKey);
            dotNet.invokeMethodAsync('Resume').then(() => {
                paused = false;
                waitingAck = false;
            });
        }
        function resumeKey(e) {
            if (e.code === 'Space') resume();
        }
        canvas.addEventListener('click', resume);
        window.addEventListener('keydown', resumeKey);
    }
    /* -------------------------------- */

    async function loop() {
        if (!paused) {
            const data = await dotNet.invokeMethodAsync('UpdateFrame');

            // ---------- desenhar jogo ----------
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // bola
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(data.ballX + data.ballR, data.ballY + data.ballR,
                data.ballR, 0, Math.PI * 2);
            ctx.fill();

            // paddle
            ctx.fillStyle = 'red';
            ctx.fillRect(data.paddleX, data.paddleY,
                data.paddleW, data.paddleH);

            // linha amarela
            ctx.strokeStyle = 'yellow';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, canvas.height - 2);
            ctx.lineTo(canvas.width, canvas.height - 2);
            ctx.stroke();

            // HUD
            ctx.fillStyle = 'white';
            ctx.font = '16px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(`Score: ${data.score}`, 10, 20);
            ctx.fillText(`Tempo: ${data.elapsed}s`, 10, 40);

            // ------------------------------------

            if (data.pause && !waitingAck) {
                paused = true;
                drawPauseScreen();
                attachResumeHandlers();
            }
        } else if (waitingAck) {
            // continua mostrando tela de pausa
            drawPauseScreen();
        }

        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
};

window.registerKeyHandlers = function (dotNet) {
    window.addEventListener('keydown', e => {
        if (e.code === 'ArrowLeft') dotNet.invokeMethodAsync('KeyDown', -1);
        if (e.code === 'ArrowRight') dotNet.invokeMethodAsync('KeyDown', 1);
    });
    window.addEventListener('keyup', e => {
        if (e.code === 'ArrowLeft') dotNet.invokeMethodAsync('KeyUp', -1);
        if (e.code === 'ArrowRight') dotNet.invokeMethodAsync('KeyUp', 1);
    });
};

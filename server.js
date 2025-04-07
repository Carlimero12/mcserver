const express = require('express');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
let serverProcess = null;

// Starte den Minecraft-Server automatisch beim Node-Start
function startMinecraftServer() {
    if (serverProcess) {
        console.log('Minecraft-Server läuft bereits.');
        return;
    }

    const jarPath = path.join(__dirname, 'web_server', 'spigot.jar');

    serverProcess = spawn('java', ['-Xmx1G', '-Xms1G', '-jar', jarPath, 'nogui'], {
        cwd: path.join(__dirname, 'web_server')
    });

    serverProcess.stdout.on('data', (data) => {
        console.log(`MC: ${data}`);
    });

    serverProcess.stderr.on('data', (data) => {
        console.error(`MC ERROR: ${data}`);
    });

    serverProcess.on('close', (code) => {
        console.log(`Minecraft-Server wurde beendet (Code: ${code})`);
        serverProcess = null;
    });

    console.log('Minecraft-Server wurde gestartet.');
}

// Starte beim App-Start
startMinecraftServer();

app.get('/', (req, res) => {
    res.send('Minecraft-Server läuft im Hintergrund. ✨');
});

app.get('/stop-server', (req, res) => {
    if (!serverProcess) return res.send('Server läuft nicht.');
    serverProcess.stdin.write('stop\n');
    res.send('Server wird gestoppt...');
});

app.listen(3000, () => {
    console.log('Panel erreichbar unter: http://localhost:3000');
});

import * as http from 'http';

export function startOAuthServer(onToken: (token: string) => void): http.Server {
  const server = http.createServer((req, res) => {
    if (req.url?.startsWith('/auth/callback')) {
      // Twitch sendet den Token im URL-Fragment (#), nicht als Query-Parameter
      // Der Server kann das Fragment nicht sehen, also müssen wir JavaScript nutzen
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>StreamMatrix - Login Erfolgreich</title>
            <meta charset="UTF-8">
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                background: linear-gradient(135deg, #0E0E10 0%, #1F1F23 100%);
                color: white;
              }
              .container {
                text-align: center;
                padding: 40px;
                background: rgba(31, 31, 35, 0.8);
                border-radius: 16px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                max-width: 400px;
                backdrop-filter: blur(10px);
              }
              .icon {
                font-size: 64px;
                margin-bottom: 20px;
                animation: bounce 0.6s ease-in-out;
              }
              @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-20px); }
              }
              h1 {
                font-size: 28px;
                margin-bottom: 12px;
                color: #9146FF;
              }
              p {
                font-size: 16px;
                color: #ADADB8;
                margin-bottom: 24px;
              }
              .spinner {
                border: 4px solid rgba(145, 70, 255, 0.2);
                border-top: 4px solid #9146FF;
                border-radius: 50%;
                width: 48px;
                height: 48px;
                animation: spin 1s linear infinite;
                margin: 0 auto;
              }
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              .success {
                color: #00F593;
              }
              .error {
                color: #FF4444;
              }
              .close-info {
                margin-top: 20px;
                font-size: 14px;
                color: #6C6C7C;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="icon">🎮</div>
              <h1>Login wird verarbeitet...</h1>
              <p>Verbinde mit StreamMatrix</p>
              <div class="spinner"></div>
            </div>
            <script>
              // Extrahiere Token aus URL-Fragment
              const hash = window.location.hash.substring(1);
              const params = new URLSearchParams(hash);
              const token = params.get('access_token');
              
              if (token) {
                // Sende Token an Server
                fetch('/auth/token', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ token: token })
                }).then(() => {
                  document.querySelector('.container').innerHTML = \`
                    <div class="icon">✅</div>
                    <h1 class="success">Erfolgreich angemeldet!</h1>
                    <p>Kehre zu StreamMatrix zurück</p>
                    <p class="close-info">Dieses Fenster schließt sich automatisch...</p>
                  \`;
                  setTimeout(() => window.close(), 2000);
                }).catch(() => {
                  document.querySelector('.container').innerHTML = \`
                    <div class="icon">❌</div>
                    <h1 class="error">Verbindungsfehler</h1>
                    <p>Bitte versuche es erneut</p>
                  \`;
                });
              } else {
                document.querySelector('.container').innerHTML = \`
                  <div class="icon">❌</div>
                  <h1 class="error">Fehler</h1>
                  <p>Kein Zugriffstoken gefunden</p>
                  <p class="close-info">Bitte versuche dich erneut anzumelden</p>
                \`;
              }
            </script>
          </body>
        </html>
      `);
    } else if (req.url === '/auth/token' && req.method === 'POST') {
      // Empfange Token vom Client-JavaScript
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const { token } = JSON.parse(body);
          if (token) {
            onToken(token);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
            // Server nach 3 Sekunden schließen
            setTimeout(() => server.close(), 3000);
          } else {
            res.writeHead(400);
            res.end();
          }
        } catch (e) {
          res.writeHead(400);
          res.end();
        }
      });
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  server.listen(3000, () => {
    console.log('OAuth Server läuft auf http://localhost:3000');
  });

  return server;
}

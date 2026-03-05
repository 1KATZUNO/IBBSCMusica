<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0A0A0B; color: #E8E8E8; margin: 0; padding: 40px 20px; }
        .container { max-width: 480px; margin: 0 auto; background: #111113; border-radius: 16px; padding: 40px; border: 1px solid rgba(255,255,255,0.06); }
        .logo { text-align: center; margin-bottom: 24px; font-size: 24px; font-weight: 700; color: #fff; }
        h1 { font-size: 20px; text-align: center; margin: 0 0 8px; color: #fff; }
        .subtitle { text-align: center; color: #888; font-size: 14px; margin-bottom: 32px; }
        .btn { display: block; text-align: center; padding: 14px 24px; background: linear-gradient(135deg, #6C5CE7, #E17055); color: #fff; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 15px; margin: 24px auto; max-width: 280px; }
        .info { background: rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; margin: 20px 0; font-size: 13px; color: #aaa; }
        .footer { text-align: center; font-size: 11px; color: #555; margin-top: 32px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">IBBSC Musica</div>
        <h1>Te han invitado</h1>
        <p class="subtitle">{{ $invitation->inviter->name }} te ha invitado a unirte a <strong>{{ $invitation->organization->name }}</strong></p>

        <div class="info">
            <strong>Rol:</strong> {{ $invitation->role === 'admin' ? 'Administrador' : 'Miembro' }}<br>
            <strong>Expira:</strong> {{ $invitation->expires_at->format('d/m/Y') }}
        </div>

        <a href="{{ $acceptUrl }}" class="btn">Aceptar Invitacion</a>

        <div class="footer">
            Si no esperabas esta invitacion, puedes ignorar este email.
        </div>
    </div>
</body>
</html>

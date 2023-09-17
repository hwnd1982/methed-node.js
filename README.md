server
'Content-Length', 50 - если меньше = ошибка, больше данные будут обрезаны.
'Content-Length', Buffer.byteLength(data) - data может быть файлом считанным с помощью fs

'Cache-Control', 'no-cache' | 'no-store' | 'public' | 'private' 'max-age=60'
'User-Agent', 'MethedApp/1.0'
'Location', 'https://google.com'

client

'Authorization', API_KEY
'User-Agent', 'MethedApp/1.0'

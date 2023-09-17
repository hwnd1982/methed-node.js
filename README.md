# Генерация закрытого ключа

openssl genpkey -algorithm RSA -out server-key.pem

# Генерация самоподписанного сертификата

openssl req -new -key server-key.pem -x509 -days 365 -out server-cert.pem

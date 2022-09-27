# Репозиторий movies-explorer-api, хранящий API для взаимодействия с бэкэнд-частью приложения по просмотру фильмов


## Ссылки

Текущая версия api опубликована по адресу:
https://api.movies.itdolmatova.nomorepartiesxyz.ru
IP-адрес сервера: 158.160.9.127



Бесплатный сервер выдачи сертификатов возвращает ошибку:
2022-09-27 21:01:20,414:DEBUG:acme.client:Received response:
HTTP 429
Server: nginx
Date: Tue, 27 Sep 2022 21:01:20 GMT
Content-Type: application/problem+json
Content-Length: 223
Connection: keep-alive
Boulder-Requester: 723292917
Cache-Control: public, max-age=0, no-cache
Link: <https://acme-v02.api.letsencrypt.org/directory>;rel="index"
Replay-Nonce: 000145IFl69Lzoe8IOEhHgplcnDlc4NVYIeswhOPZ61iJjU

{
  "type": "urn:ietf:params:acme:error:rateLimited",
  "detail": "Error creating new order :: too many certificates already issued for: nomorepartiesxyz.ru: see https://letsencrypt.org/docs/rate-limits/",
  "status": 429
}

на офиц.сайте https://letsencrypt.org/docs/rate-limits/:
The main limit is Certificates per Registered Domain (50 per week). A registered domain is, generally speaking, the part of the domain you purchased from your domain name registrar. For instance, in the name www.example.com, the registered domain is example.com. In new.blog.example.co.uk, the registered domain is example.co.uk. We use the Public Suffix List to calculate the registered domain. Exceeding the Certificates Per Registered Domain limit is reported with the error message too many certificates already issued, possibly with additional details.

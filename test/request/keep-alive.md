Keep-Alive header
=================

## Garbage before and after

<!-- meta={"type": "request"} -->
```http
GET /demo HTTP/1.1
Connection: keep-alive
Keep-Alive: something,\t something,, stimeout=42, timeout=123, something


```

```log
off=0 message begin
off=4 len=5 span[url]="/demo"
off=20 len=10 span[header_field]="Connection"
off=32 len=10 span[header_value]="keep-alive"
off=44 len=10 span[header_field]="Keep-Alive"
off=56 len=59 span[header_value]="something,\t something,, stimeout=42, timeout=123, something"
off=119 headers complete method=1 v=1/1 flags=401 content_length=0
off=119 should_keep_alive=123
off=119 message complete
```

## Duplicate timeout

<!-- meta={"type": "request"} -->
```http
GET /demo HTTP/1.1
Connection: keep-alive
Keep-Alive: timeout=1, timeout=2, timeout=a


```

```log
off=0 message begin
off=4 len=5 span[url]="/demo"
off=20 len=10 span[header_field]="Connection"
off=32 len=10 span[header_value]="keep-alive"
off=44 len=10 span[header_field]="Keep-Alive"
off=56 len=31 span[header_value]="timeout=1, timeout=2, timeout=a"
off=91 headers complete method=1 v=1/1 flags=401 content_length=0
off=91 should_keep_alive=1
off=91 message complete
```

## Invalid timeout

<!-- meta={"type": "request"} -->
```http
GET /demo HTTP/1.1
Connection: keep-alive
Keep-Alive: timeout=4a


```

```log
off=0 message begin
off=4 len=5 span[url]="/demo"
off=20 len=10 span[header_field]="Connection"
off=32 len=10 span[header_value]="keep-alive"
off=44 len=10 span[header_field]="Keep-Alive"
off=56 len=10 span[header_value]="timeout=4a"
off=70 headers complete method=1 v=1/1 flags=1 content_length=0
off=70 message complete
```

## Zero timeout

<!-- meta={"type": "request"} -->
```http
GET /demo HTTP/1.1
Connection: close
Keep-Alive: timeout=0


```

```log
off=0 message begin
off=4 len=5 span[url]="/demo"
off=20 len=10 span[header_field]="Connection"
off=32 len=5 span[header_value]="close"
off=39 len=10 span[header_field]="Keep-Alive"
off=51 len=9 span[header_value]="timeout=0"
off=64 headers complete method=1 v=1/1 flags=402 content_length=0
off=64 should_keep_alive=0
off=64 message complete
```

## Connection: close

<!-- meta={"type": "request"} -->
```http
GET /demo HTTP/1.1
Connection: close
Keep-Alive: timeout=4


```

```log
off=0 message begin
off=4 len=5 span[url]="/demo"
off=20 len=10 span[header_field]="Connection"
off=32 len=5 span[header_value]="close"
off=39 len=10 span[header_field]="Keep-Alive"
off=51 len=9 span[header_value]="timeout=4"
off=64 headers complete method=1 v=1/1 flags=402 content_length=0
off=64 should_keep_alive=0
off=64 message complete
```

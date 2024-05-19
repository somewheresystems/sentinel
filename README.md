# sentinel
Sentinel is a system which uses Voice Agents to send outbound dialers (telemarketers) to the shadow realm

```
docker build -t sentinel .
docker run -it -p ${PORT:-3000}:${PORT:-3000} sentinel
```
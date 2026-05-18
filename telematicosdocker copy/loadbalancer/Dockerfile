FROM haproxy:2.3
COPY haproxy.cfg /usr/local/etc/haproxy/haproxy.cfg


docker run -d \
  --name haproxy \
  --network telematicosnetwork \
  -p 8080:80 \
  -p 8404:8404 \
  -v "$PWD/haproxy.cfg:/usr/local/etc/haproxy/haproxy.cfg:ro" \
  -l com.datadoghq.ad.checks='{
    "haproxy":{
      "init_config":{},
      "instances":[
        {
          "openmetrics_endpoint":"http://%%host%%:8404/metrics",
          "use_openmetrics":"true"
        }
      ]
    }
  }' \
  -l com.datadoghq.ad.logs='[
    {
      "source":"haproxy",
      "service":"haproxy"
    }
  ]' \
  haproxy:2.6
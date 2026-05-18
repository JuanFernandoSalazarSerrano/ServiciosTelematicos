FROM artilleryio/artillery:2.0.31


docker run -it --rm \
  --name artillery \
  --network telematicosnetwork \
  -v "../artillerysmoketesting:/scripts" \
  artillery:latest \
  run /scripts/financeinfo-scenarios.yml
docker build -t ontrip_service .
docker run --rm -it -d -p 3001:3001 --name ontontrip_servicer ontrip_service
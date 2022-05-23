docker build -t ontrip_server .
docker run --rm -it -d -p 3001:3001 --name ontrip_server ontrip_server
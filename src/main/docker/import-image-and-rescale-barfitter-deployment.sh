microk8s.ctr -n k8s.io images remove docker.io/library/barfitter:local && 
microk8s.ctr -n k8s.io image import /root/docker_images/barfitter.tar &&
kubectl scale --replicas=0 -f /root/docker_images/barfitter/barfitter-deployment.yml && 
kubectl scale --replicas=1 -f /root/docker_images/barfitter/barfitter-deployment.yml

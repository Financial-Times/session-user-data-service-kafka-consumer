#/bin/bash 

##
#insert the command line options here that you need to run your app
#Env vars are available here for example $PORT will work (assuming you've set
#them at https://ftppm520-lvuk-uk-p.osb.ft.com/admin/deployments/nodegroup/88/)
##

#
#Treat this like a procfile for heroku, just without the "web:" bit at the start
#

#printing the Environment vars for debug:
echo "Start of Envionment vars:"
echo ZOOKEEPER_HOSTS:
echo "    $ZOOKEEPER_HOSTS"
echo LOG_LEVEL:
echo "    $LOG_LEVEL"
echo "End of Envionment vars"
echo " "
node --harmony server.js

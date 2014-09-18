Shiftypages
=========================

A free blog system for Openshift.

This blog installs on a free gear from Openshift and utilizes free image hosting on Flickr to create a completely free hosted blog. On the backend the system uses paperclip with imgkit to handle resaving edited images and sidekiq with redis to deal with the lag of uploading to Flickr.

Demo: [ShiftyPages.com](http://www.shiftypages.com)

Openshift Installation
----------------------

1. Create an [Openshift](https://www.openshift.com/app/account/new) and [Flickr](https://www.flickr.com/signup/) account if you have not already done so.

2. Install and configure the Red Hat Client tools and Git by following the instructions [here](https://www.openshift.com/developers/rhc-client-tools-install).

3. Navigate to the folder on your computer where you would like to save a local copy of the app and run:

        rhc create-app shiftypages ruby-1.9 mysql-5.5 cron-1.4 http://cartreflect-claytondev.rhcloud.com/reflect?github=smarterclayton/openshift-redis-cart

7. When that finishes, navigate to the new application's directory, add the shiftypages code and push it to Openshift with: 

        cd shiftypages
        git remote add upstream -m master https://github.com/imjoeco/shiftypages.git
        git pull -s recursive -X theirs upstream master
        git push

8. Once that finishes you should be able to access your blog on the web with the URL Openshift provides on their [website](https://openshift.redhat.com/app/console/applications) and finish the installation from there.

License
-------

Copyright 2014 Joseph Hernandez

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Cactus obfuscator tool.

How to use it:


Run in terminal the following command:
java -jar cactus-tool.jar -d ../web/js -o cache

where:

-d - (OPTIONAL)The path to folder contains cactus.xml file. All files in cactus.xml are specified with relative path from this folder.
     if source directory wasn't specified the tool tries to get cactus.xml from the current working directory.
     
-o - (OPTIONAL) relative path to destination/output folder
 	 if output directory wasn't specified all output will be going to -d (source directory)
 	 
-m - (OPTIONAL) The mode: PRODUCTION/DEBUG
     default mode is  PRODUCTION - obfuscation is ON.
CHANGELOG for 1.3.x

This changelog references the relevant changes (bug and security fixes) done in 1.3 minor versions.

* 1.3 (2012-10-11)

58de4fd (HEAD, tag: v1.3, origin/master, origin/HEAD, master) Update lib/command/model/afStudioModelCommand.class.php
591fd3a resolved bug on widget creation
6370f47 fixed bug on model modificator
2aca190 not parsing php tags in helper.yml
6547c46 added task afs:db-connectivity for checking database connectivity for all connections; using this task in afs:init
6c13463 added import/export for model's definition
f9b1314 added attention message to rename model command
2f2f707 use of sfInflector when creating new model/table name
9fe91b7 added renaming of table name in schema.yml when renaming the model name
b6da07f Merge pull request #22 from eventhorizonpl/fix_permissions
62587ee some files may not exist
11ad6ff studio production mode enabled; models diagram preview is run
1ab1392 Merge branch 'model-visualizer'
a01a34c (origin/model-visualizer) added Models Diagram tool-bar button at models navigation  for running diagram
11a5721 Updating model connections when it is moved due to its container viewport was resized in AF Studio (i.e. enlarging the navigation panel, changing its width). Show fields having no type definition (type definition == null).
4d1612f fixed executing multiple sql in db Query says that there is a connection issue between app and db, in growl
3acb228 #1394 tiny diagram code improvements; added docs
d6729da #1394 preparing to display model diagram component, masking it during loading underlying diagram mini-application
842f4da New fks should have int 11 and index=true set - done
d187480 htmlEscape entries from the model grid #1384 - done
961f897 Export/Import Model definition #1248 - more changes on Import sql feature on Import File Upload window
35bc30d Export/Import Model definition #1248 - added Import sql feature on Import File Upload window
2951c41 Export/Import Model definition #1248 - added Export menu and Export structure button
1f7aa83 communication controller; afStudio reference and active/opened in studio component references accessible from diagram application
9e17953 added diagram's ready event, load event processing and underlying iframe error displaying
abc2690 Merge pull request #21 from eventhorizonpl/retrive_fix
59cc5cd add missing argument to afsWidgetModelHelper::retrieve
027f933 Merge pull request #20 from eventhorizonpl/run_permissions
706d65e Merge pull request #19 from eventhorizonpl/cd_command_fix_fix
5e928e8 check permissions before run project
8846bcf final fix for console cd and related problems
0afac5a Merge pull request #18 from eventhorizonpl/settings_permissions
9054514 Merge pull request #17 from eventhorizonpl/log_permissions
3508738 Merge pull request #15 from eventhorizonpl/plugin_permissions
8edec69 Merge pull request #14 from eventhorizonpl/layout_permissions
1ee6a02 Merge pull request #16 from eventhorizonpl/theme_designer_permissions
a709a89 permissions check for settings
98a8704 check permission for log files
adbcd75 permissions checks for theme designer
3aa9ae6 checking permissions for plugin and fix directory for widget permissions checking
1ae74e3 permissions checks for layout
3d3b52d Merge pull request #13 from eventhorizonpl/file_permissions
2057302 checking permissions for file
af99147 Merge pull request #12 from eventhorizonpl/widget_permissions
0e7e4a1 permissions checking for widgets
6ddbc90 extjs-4.1.1 source files
b4d6540 Merge pull request #11 from eventhorizonpl/module_permissions
2080b5e permissions check for modules
7d2708b Merge pull request #10 from eventhorizonpl/model_permissions
5361f96 check model permissions
739304b #1394 added extjs4.1.1 dev file
4c30f49 Merge pull request #9 from eventhorizonpl/permissions
3de96cf #1394 diagram tabpanel
68d610b class for checking dir, file or link permissions
60fe687 Merge pull request #7 from eventhorizonpl/session_adapter
3965b19 Merge pull request #8 from eventhorizonpl/cd_command_execution_fix
f91ac5f Merge pull request #5 from eventhorizonpl/fix_afs_generate_widget_all
eac7791 Merge pull request #6 from eventhorizonpl/fix_missing_argument
e1a1ab1 Merge pull request #4 from eventhorizonpl/fix_db_structure_export
efaba8a Merge pull request #3 from eventhorizonpl/afs_integrity
63f8968 #1394 added diagram component
609f9ce command execution fix and escapeing fix
8aa365a session adapter take1
9c27503 fix missing argument
4dab1c9 fix for afs:generate-widget-all task
30c6325 #1394 removed incorrect _indexes attribute in resolving models connections on diagram
568fd01 change by_os default to true for export command - compatibility fix for unix systems
62ee17e fix afs:integrity task on unix systems - psr-0 compatibility issue
dc86f84 #1394 adapted code to ext 4.1.1; added todos for next reconstruction and improvement; code examination; planning of creating communication between this embed ext 4 component in an iframe and ext 3 studio models structure
3419adf Merge pull request #2 from eventhorizonpl/console_menu
6daee66 console menu
f111d4a #1394 first try of Pavel's model graphing code with ext4.1.1 code must be polished and organised, after it the prepared page can be embeded into studio using iframe
4dc2e73 Merge pull request #1 from eventhorizonpl/console_cd
c2995cc cd command
48eb8e2 #1394 structure improving 1. switch on extjs developers mode 2. clean up template 3. added application's modules bootstrapper
f83d9eb #1394 models - visualizer    1. added basic structure to evolve extjs-4th version modules and applications inside existing studio code    2. new ext4th code for models-diagram (visualizer) will be plugged with a try to use iframe escaping a lot of incompatibilities between 3rd and 3th version and 4th version's sandbox mode and a lot of Studio now css overrides and code which can brings a lot of headache to work with, especially what we are not plan on this stage completely rewrite the Studio to 4th version of extjs
b681120 delete action is generated and is automatically added as i:action in list, if list is generated
984a5dc removed beta keyword
99af6e6 enable debug mode
732c9a5 #1394 - created save and get structure commands for models, changed model command modificator
ee344aa #1391 - created widget cache class helper, some changed related to widget type in view widget model class
204e1e7 #1328 - theme designer AF Studio integration
ef442da #1328 - integrated viewport theme editors; added dblclick on the theme opening its editors on the theme editors tab
3e3ae04 #1328 - added mixin class to implement general behaviour of designer-container tabs; corrected bug in css editor; improved behavior of save/save and close controll buttons.
4074aa8 #1328 - theme designer tab, control save(s) buttons
6aae987 #1328 - integrated Desktop theme's background editor
29c4268 #1328 - integrated Desktop theme's shortcuts editor
0260afb #1328 - integrated Desktop theme's start menu editor
2dded50 ViewMessageBox - overridden beforeDestroy template method to manually release resources
8e8e1b4 #1328 - fires themeSelection event only if the theme was indeed changed, current theme != the selected(clicked) one
ed264a0 #1328 - updating theme editors after theme selection; added message-box placeholder for init state of the theme designer tab.
c5ced64 improved ViewMessageBox, added listener of owner container "afterlayout" event updating the message-box position, instead of doing it manually
b9b354e #1328 - display currently selected theme's editors in Theme Designer tab.
2399eab #1328 - Theme Designer tab, instantiated theme editors
b442ce8 #1328 - added three controls buttons save, save and close and cancel; theme selector and css editor works fine
9ebd046 #1328 - added css editor. To test new theme design: 1. go to the debug mode app.yml set debug: true 2. open studio and run the following code in the browser's console var d = new afStudio.theme.Designer(); d.show();
94790ad #1389 - basic autofix functionality
55354c4 #1389 - changed integrity configuration schema, made possible to use same configuration for autofix/fix
2fb6931 #1389 - some changes in checking integrity, preparing for glue with autofix, small changes in Model rule
230f01e #1388 - fixed problem with initialize when playground migrated to propel 1.6, excluded processing propels skeleton schema
910cc24 #1328 - theme re-design, added base theme window and theme selector tab
0ba9c87 #1367 - fixed problem that data wasn't properly displayed, if exists propels hidden id field
b0735ce #1248 - some changes in import/export processing
b4099d8 #1276 - if has been added custom code, content should be renamed when rename model process, and user notified that has been changed some model classes where exists custom code
79caf37 #1248 - created export/import model definition actions
92c62dc #1276 - create basic classes for schema processing
8fbbf0f #1324 - created task that will show integrity status
301b770 #1324 - added launcher of check integrity for models, and config option to switch on/off from config
b1f57b5 #1324 - created renderer for check integrity functionality
6b29f15 #1324 - added possibility to execute specific actions from rules
5400f26 #1385 - added action rule that will check is all migrations executed
f3880fb #1385 - changes related to show data using current num for fields instead increment dummy counter
c3accc6 #1385 - created functionality to check schema, fields validation, tables synchronization with current db, tables names, foreign fields verifications, indexes validation, commit also related to #1324
d31dc61 #1333 - shortcuts styles
fef8423 #1333 - updating shortcuts properties
072ae54 #1333 - implemented functionality add,insert,delete shortcuts nodes; drag and drop is working now
b6762fd #1345 - fixed project source export
161977d added afs:sql-diff --insert=true|false --build=true|false
6cbf42c created afs:build-sql-diff, afs:insert-sql-diff
f606ef2 changed afs:init task
f4aa2bd #1383 - export data from a Model done; also added direct hash link in Studio to open a file in code editor, example: /studio#file#config/databases.yml; when exporting the Model data, a link to exported sql is provided in the popup message [status:resolved]
072a8d1 #1383 - first commit on export window [status:assigned]
19ff5ff changed layout hashing
f7047a1 changed WD hashing
0478a41 changed WD hashing
eb94030 changed WD hashing
3e3af8a added changes to WD hashing
fe0dc2a added hashing history to Studio; for widgets: /studio#widget#application/module/action; for layouts: /studio#layout#application/action
40552d4 1333 - shortcuts, implemented foundation structure
80adfb9 #1329 - added support for "icon" property - icon image for start menu
65b2cd7 #1329 - managing menu "title" and "iconCls" attributes; to manage start-menu attributes, select root node of main menu inspector-tree
c460a9d #1329 - tools menu: live preview of items properties
04e2115 #1329 - tools menu: items CRUD and D&D
2c4be57 corrected wrong addToolItem method inside desktop theme Ext.ux.StartMenu; added insertToolItem method having possibility to insert tool item at specified position
64b8796 AF mvc: property is considered as valid having an empty value if it is not required in the model structure. This allows to use empty values for optional properties
a0b936f #1365 - changed i:item tag, to have ability to set up static text
b3cf0a0 #1329 - reflecting changes of "name", "label", "icon", "iconCls" properties of main menu items
4178904 #1329 - live start menu: CRUD for main menu; added icon and iconCls for tools and main menu items
1f29399 Merge branch 'perms_and_tmp_path_changes'
1c1ffcc added app_afs_chmod_enabled option that controls calls to chmod
c7a0c1c compress ace editor using cactus minifier
40624fe start menu: create new item with url property set to "#"
23ee04a start menu items corrected url property - use anyURI
5445be5 #1334 - Added possibility to place permissions.yml file outside of studio plugin
2b8ea74  #1352 - changed migration commands
38e3f05 #1348 - update studio after color-field was changed; improve bg-editor
951635e added latest models based on new Propel 1.6
7dc56b3 changed path
60d2a04 #1324 - changed structure, added helper, created base abstracted rule class
a06ffa3 #1324 - create base structure of checking integrity functionality
3fba600 improved afStudio.xhr; improved welcome screen html update
f3ec639 ACE - activated noconflict mode; fixed bug related to loading ace mode in IE
1c0990d removing useless resources; changes in af mvc; startmenu start reflection of model changes
f93aaf8 update ACE editor, new code folding feature, added sql mode
b0867af #1342 - use password field instead text for passwords; removed empty text attribute, it is straightforward  that user should type into username and password fields
1b3d99c small change on Vimeo video fetching class
b8fe5f8 #1329 - init start menu view
cab7634 af mvc added dumping method of model nodes and view components relations into ModelMapper interface
91c8ac6 af mvc extending model interface mixin - switching between several controllers
3288da1 #1329 - refactoring in studio MVC model; introduction of start menu view component
6e0a64e #1329 - introduction of desktop ux
0f493dc #1332 - Tested with YML, CSV, XLS, XLSX, ODS: added several fixes, changed fixtire loading see ticket
e949b39 replace direct usage of Ext.Ajax into afStudio.xhr; corrected several urls
28c6245 encapsulated "requestcomplete" event and setTimeout of Ext.Ajax inside afStudio.xhr singleton; improved global logging method
31c480c afStudio.xhr updates; ajax requests converts to more tiny and centralized
e11deb7 afStudio.xhr improvement to reduce boilerplate code and centralize ajax request going via Ext.Ajax
e07cd76 added namespace config definition for AppFlower\Studio to config
331a217 removed unused code/clearing
c1590b0 removed redundant override code
b7ed403 added autoloader with possibility using classes with namespaces inside studio
3b7c790 #1313 - WD: rendering actions file tab bug fixed
4067752 #1154 - models: allow to use 0 as default value for integers; fixed bug for model config editors
475c11b modelsTree common component
883ddb7 added common modelsTree AFStudio component for listing all available models in a tree; corrected sorting of models inside the tree - ASC direction
1d3ee73 Fixed YML warnings, added model check
0f92263 added "Append" checkbox to upload file-import form
58f768d #1298 - enclosure symbols fix
687a956 #1298 - changes in getting files list from request
3d38c45 #1298 - load/importing fixtures fixies
3e970c8 #1298 - prepare response for grid
800cd44 #1298 - some fast fixes for response
939e4e9 #1298 - get fixtures change
1f01349 #1298 - import form implemented
dfe8c52 #1298 - created layout of upload import file form
5d2f06f added common models combobox component
91e9e50 #1298 - upload import file form introduction
0bb7db5 #1298 - import fixtures form
712da07 models icons update; removed not used icons
f88b1ba small fix, added cast in save helper functionality
a813133 updated cache
2df1f83 layouts icons update

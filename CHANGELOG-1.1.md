CHANGELOG for 1.1.x

This changelog references the relevant changes (bug and security fixes) done in 1.1 minor versions.

* 1.1.0beta (2011-12-16)

 * Possibility to use Studio and Engine with Windows, UNIX dependencies removed
 * Created filters predictions when create widget list processing
 * Created field types and validators predictions when creating widget edit processing
 * Possibility to make upload file related to some model in very easy steps from UI
 * Sort and filtering enhanced in combo box
 * Show pages/widgets without extension name, removed .xml in layouts
 * Changed console functionality - any OS commands can be executed unless they aren't in the deprecated list
 * Deprecated some support plugins in grouped list when adding widget processing 
 * Added afs:version symfony task to be used in displaying the current version of appFlower plugins, based on composer.json
 * Models focus stealing bug - fixed jumping focus behavior from one empty cell to another below the first and so on 
 * Create widgets from model, simple wizard - added button to the Models component allowing easily, in several clicks, to create a widget from the current model
 * Widget Builder - multiple selection of fields to select (mark multiple and drag), also added a new button to add all fields, except id
 * Widget Builder - added remove all button from the field selection step (resets all)
 * Widget Builder - focus the wizard window and widget location field to speed up development using keyboard
 * Widget Builder - Drag&Drop error fixed
 * Widgets fields transformation when widget is created i.e. foo_name -> FooName
 * Code Browser - unarchive context menu action, unarchive tgz/tar.gz directly in code browser  
 * Code browser in available directly from top toolbar
 * Widget Designer - Edit view first working version  
 * Widget Designer appearance changed - Code Browser is placed in east panel. Widget Designer has only one code browser now
 * Layout Designer - when adding a widget, auto-expand first level of the tree, so it's faster to pick
 * Desktop Start Menu editor - first version available from Theme Designer > Editors
 * Desktop Shortcuts editor - first version available from Theme Designer > Editors
 * Desktop Background editor available from Theme Designer > Editors
 * Fixed saving in tabbed layout
 * Fixed users issue, when create new user processing
 * Fixed reverse order bug in Models when adding new data to a model
 * Fixed DBQuery pagination bug, after not fetching (select) clauses
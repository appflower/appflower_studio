<script type="text/javascript" src="/appFlowerPlugin/extjs-3/adapter/ext/ext-base-debug.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/ext-all-debug.js"></script>
<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerPlugin/extjs-3/resources/css/ext-all.css" />
<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerPlugin/extjs-3/resources/css/xtheme-blue.css" />
<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerPlugin/css/my-extjs.css" />

<script type="text/javascript" src="/appFlowerPlugin/js/custom/widgetJS.js"></script>

<script type="text/javascript">
Ext.onReady(function(){
	Ext.QuickTips.init();

	var path = Ext.urlDecode(location.search.substr(1));

	afApp.urlPrefix = '/';
	GLOBAL_JS_VAR = GLOBAL_CSS_VAR = new Array();
	afApp.widgetPopup(path.uri, path.uri, null, null, Ext.getBody());	
});
</script>

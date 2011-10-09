<script type="text/javascript" src="/appFlowerPlugin/extjs-3/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/ext-all.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/cache/appFlower.js"></script>
<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerPlugin/extjs-3/resources/css/ext-all.css" />
<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerPlugin/extjs-3/resources/css/xtheme-blue.css" />
<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerPlugin/cache/appFlower.css" />

<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/notification/MessageBox.js"></script>

<script type="text/javascript">
Ext.BLANK_IMAGE_URL = '/appFlowerPlugin/extjs-3/resources/images/default/s.gif';
Ext.state.Manager.setProvider(new Ext.state.CookieProvider());

Ext.onReady(function(){
	Ext.QuickTips.init();

	Ext.Ajax.on('requestcomplete', function(conn, xhr, opt) {
        var response;
		try {
			response = Ext.decode(xhr.responseText);
		} catch(e) {
			afStudio.Msg.error('Response cannot be decoded', 
					String.format('<u>url</u>: <b>{0}</b> <br/>{1}', opt.url, xhr.responseText));
			return;
		}
		
		if (Ext.isDefined(response.success) && response.success == false) {
			var message = response.message || String.format('Request failed <u>url</u>', opt.url);
			afStudio.Msg.error(message);
		}
	});
	
	var path = Ext.urlDecode(location.search.substr(1));
	
	afApp.urlPrefix = '/';
	GLOBAL_JS_VAR = GLOBAL_CSS_VAR = new Array();
	afApp.widgetPopup(path.uri, path.title ? path.title : path.uri, null, null, {});	
});
</script>

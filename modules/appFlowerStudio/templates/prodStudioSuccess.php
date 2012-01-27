<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerPlugin/extjs-3/resources/css/ext-all.css" />
<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerPlugin/extjs-3/resources/css/xtheme-blue.css" />
<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerStudioPlugin/cache/af.css" />
<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerStudioPlugin/cache/afStudio.css" />

<script type="text/javascript" src="/appFlowerPlugin/extjs-3/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/ext-all.js"></script>

<script type="text/javascript" src="/appFlowerStudioPlugin/cache/af.js"></script>
<?php include_partial('studioSettings', array('afStudioUser' => $afStudioUser)); ?>
<script type="text/javascript" src="/appFlowerStudioPlugin/cache/afStudio.js"></script>

<script type="text/javascript">
	Ext.onReady(afStudio.init, afStudio);
</script>

<div id="toolbar-container-el"></div>
<form id="history-form" class="x-hidden"><input type="hidden" id="x-history-field" /><iframe id="x-history-frame"></iframe></form> 
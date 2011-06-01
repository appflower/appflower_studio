Ext.apply(Ext.form.VTypes, {
    uniqueNode: function(value, field) {
    	var tree = field.ownerCt.ownerCt.tree;
    	var currentNode = tree.getSelectionModel().getSelectedNode();
    	var slug = afStudio.createSlug(value);
      if(currentNode.childNodes)
  		{
  			for(var i=0;i<currentNode.childNodes.length;i++)
  			{
  				if(!currentNode.childNodes[i].isLeaf()&&currentNode.childNodes[i].text == slug)
  				{
  					return false;
  				}
  			}
  		}
    	return true;
    },
 
    uniqueNodeText : 'Path to Project already exist! Please choose another Project Name!',
    
    checkPassword: function(value, field) {
        if(field.ownerCt.ownerCt.ownerCt.getForm().findField('password').getValue()!=value)
				{				 
				  return false;
				}
				return true;
    },
    
    checkPasswordText : 'Retype Password value does not match Password value',

    database: function(value, field)
    {
        return /^[a-zA-Z0-9_\-]+$/.test(value);
    },
    
    databaseText : 'Database should only contain letters, numbers, _, -',
    
    databaseMask : /[a-z0-9_\-]/i,
    
    host: function(value, field)
    {
        return /^[a-zA-Z0-9_\-\.]+$/.test(value);
    },
    
    hostText : 'Host should only contain letters, numbers, dots, _, -',
    
    hostMask : /[a-z0-9_\-\.]/i,
    
    port: function(value, field)
    {
        return /^[0-9]+$/.test(value);
    },
    
    portText : 'Port should only contain numbers',
    
    portMask : /[0-9]/i,
    
    username: function(value, field)
    {
        return /^[a-zA-Z0-9_\-\.]+$/.test(value);
    },
    
    usernameText : 'Username should only contain letters, numbers, dots, _, -',
    
    usernameMask : /[a-z0-9_\-\.]/i,
});
<?php use_helper('I18N', 'Url') ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        
        <!-- Facebook sharing information tags -->
        <meta property="og:title" content="Studio Account" />
        
        <title>Studio Account</title>
		<style type="text/css">
			/* Client-specific Styles */
			#outlook a{padding:0;} /* Force Outlook to provide a "view in browser" button. */
			body{width:100% !important;} /* Force Hotmail to display emails at full width */
			body{-webkit-text-size-adjust:none;} /* Prevent Webkit platforms from changing default text sizes. */
			
			/* Reset Styles */
			body{margin:0; padding:0;}
			img{border:none; font-size:14px; font-weight:bold; height:auto; line-height:100%; outline:none; text-decoration:none; text-transform:capitalize;}
			#backgroundTable{height:100% !important; margin:0; padding:0; width:100% !important;}
			
			/* Template Styles */
			
			/* /\/\/\/\/\/\/\/\/\/\ STANDARD STYLING: COMMON PAGE ELEMENTS /\/\/\/\/\/\/\/\/\/\ */
			
			/**
			* @tab Page
			* @section background color
			* @tip Set the background color for your email. You may want to choose one that matches your company's branding.
			* @theme page
			*/
			body, #backgroundTable{
				/*@editable*/ background-color:#fff;
			}
			
			/**
			* @tab Page
			* @section email border
			* @tip Set the border for your email.
			*/
			#templateContainer{
				/*@editable*/ border: 4px solid #eee;
			}
			
			/**
			* @tab Page
			* @section heading 1
			* @tip Set the styling for all first-level headings in your emails. These should be the largest of your headings.
			* @style heading 1
			*/
			h1, .h1{
				/*@editable*/ color:#1981b6;
				display:block;
				/*@editable*/ font-family:Arial;
				/*@editable*/ font-size:17px;
				/*@editable*/ font-weight:bold;
				/*@editable*/ line-height:100%;
				margin-top:0;
				margin-right:0;
				margin-bottom:10px;
				margin-left:0;
				/*@editable*/ text-align:left;
			}

			
			/* /\/\/\/\/\/\/\/\/\/\ STANDARD STYLING: PREHEADER /\/\/\/\/\/\/\/\/\/\ */
			
			/**
			* @tab Header
			* @section preheader style
			* @tip Set the background color for your email's preheader area.
			* @theme page
			*/
			#templatePreheader{
				/*@editable*/ background-color:#FAFAFA;
			}
			
			/**
			* @tab Header
			* @section preheader text
			* @tip Set the styling for your email's preheader text. Choose a size and color that is easy to read.
			*/
			.preheaderContent div{
				/*@editable*/ color:#505050;
				/*@editable*/ font-family:Arial;
				/*@editable*/ font-size:10px;
				/*@editable*/ line-height:100%;
				/*@editable*/ text-align:left;
			}
			
			/**
			* @tab Header
			* @section preheader link
			* @tip Set the styling for your email's preheader links. Choose a color that helps them stand out from your text.
			*/
			.preheaderContent div a:link, .preheaderContent div a:visited{
				/*@editable*/ color:#336699;
				/*@editable*/ font-weight:normal;
				/*@editable*/ text-decoration:underline;
			}
			

			
			/* /\/\/\/\/\/\/\/\/\/\ STANDARD STYLING: HEADER /\/\/\/\/\/\/\/\/\/\ */
			
			/**
			* @tab Header
			* @section header style
			* @tip Set the background color and border for your email's header area.
			* @theme header
			*/
			#templateHeader{
				/*@editable*/ background-color:#D8E2EA;
				/*@editable*/ border-bottom:0;
			}
			
			/**
			* @tab Header
			* @section header text
			* @tip Set the styling for your email's header text. Choose a size and color that is easy to read.
			*/
			.headerContent{
				/*@editable*/ color:#202020;
				/*@editable*/ font-family:Arial;
				/*@editable*/ font-size:34px;
				/*@editable*/ font-weight:bold;
				/*@editable*/ line-height:100%;
				/*@editable*/ padding:0;
				/*@editable*/ text-align:center;
				/*@editable*/ vertical-align:middle;
			}
			
			/**
			* @tab Header
			* @section header link
			* @tip Set the styling for your email's header links. Choose a color that helps them stand out from your text.
			*/
			.headerContent a:link, .headerContent a:visited{
				/*@editable*/ color:#336699;
				/*@editable*/ font-weight:normal;
				/*@editable*/ text-decoration:underline;
			}
			
			#headerImage{
				height:auto;
				max-width:600px;
			}
			
			/* /\/\/\/\/\/\/\/\/\/\ STANDARD STYLING: COLUMNS; LEFT, RIGHT /\/\/\/\/\/\/\/\/\/\ */
			
			/**
			* @tab Columns
			* @section left column text
			* @tip Set the styling for your email's left column text. Choose a size and color that is easy to read.
			*/
			.leftColumnContent{
				/*@editable*/ background-color:#FFFFFF;
			}
			
			/**
			* @tab Columns
			* @section left column text
			* @tip Set the styling for your email's left column text. Choose a size and color that is easy to read.
			*/
			.leftColumnContent div{
				/*@editable*/ color:#505050;
				/*@editable*/ font-family:Arial;
				/*@editable*/ font-size:14px;
				/*@editable*/ line-height:150%;
				/*@editable*/ text-align:left;
			}
			
			/**
			* @tab Columns
			* @section left column link
			* @tip Set the styling for your email's left column links. Choose a color that helps them stand out from your text.
			*/
			.leftColumnContent div a:link, .leftColumnContent div a:visited{
				/*@editable*/ color:#336699;
				/*@editable*/ font-weight:normal;
				/*@editable*/ text-decoration:underline;
			}
			
			.leftColumnContent img{
				display:inline;
				height:auto;
			}
			
			/**
			* @tab Columns
			* @section right column text
			* @tip Set the styling for your email's right column text. Choose a size and color that is easy to read.
			*/
			.rightColumnContent{
				/*@editable*/ background-color:#FFFFFF;
			}
			
			/**
			* @tab Columns
			* @section right column text
			* @tip Set the styling for your email's right column text. Choose a size and color that is easy to read.
			*/
			.rightColumnContent div{
				/*@editable*/ color:#666;
				/*@editable*/ font-family:Arial;
				/*@editable*/ font-size:13px;
				/*@editable*/ line-height:120%;
				/*@editable*/ text-align:left;
        padding: 10px 0 20px 0px;
			}
      
      .rightColumnContent .link {
        font-family:Arial;
        font-size: 13px;
        color: #1a7501;
        background: url(<?php echo url_for("appFlowerStudioPlugin/images", true) ?>/email/blue_arrow.png) right 3px no-repeat;
        padding-right: 12px;
        text-decoration: none;
      }

      .rightColumnContent .link:hover {
        color: #1981b6;
      }

      .rightColumnContent div#dotted_line {
          margin-bottom:5px;
          border-bottom:1px dotted #666;
      }
			
			/**
			* @tab Columns
			* @section right column link
			* @tip Set the styling for your email's right column links. Choose a color that helps them stand out from your text.
			*/
			.rightColumnContent div a:link, .rightColumnContent div a:visited{
				/*@editable*/ color:#336699;
				/*@editable*/ font-weight:normal;
				/*@editable*/ text-decoration:underline;
			}
			
			.rightColumnContent img{
				display:inline;
				height:auto;
			}
			
			/* /\/\/\/\/\/\/\/\/\/\ STANDARD STYLING: MAIN BODY /\/\/\/\/\/\/\/\/\/\ */
			
			/**
			* @tab Body
			* @section body style
			* @tip Set the background color for your email's body area.
			*/
			#templateContainer, .bodyContent{
				/*@editable*/ background-color:#FDFDFD;
			}
			
			/**
			* @tab Body
			* @section body text
			* @tip Set the styling for your email's main content text. Choose a size and color that is easy to read.
			* @theme main
			*/
			.bodyContent div{
				/*@editable*/ color:#505050;
				/*@editable*/ font-family:Arial;
				/*@editable*/ font-size:14px;
				/*@editable*/ line-height:150%;
				/*@editable*/ text-align:left;
			}
			
			/**
			* @tab Body
			* @section body link
			* @tip Set the styling for your email's main content links. Choose a color that helps them stand out from your text.
			*/
			.bodyContent div a:link, .bodyContent div a:visited{
				/*@editable*/ color:#336699;
				/*@editable*/ font-weight:normal;
				/*@editable*/ text-decoration:underline;
			}
			
			.bodyContent img{
				display:inline;
				height:auto;
			}
			
			/* /\/\/\/\/\/\/\/\/\/\ STANDARD STYLING: FOOTER /\/\/\/\/\/\/\/\/\/\ */
			
			/**
			* @tab Footer
			* @section footer style
			* @tip Set the background color and top border for your email's footer area.
			* @theme footer
			*/
			#templateFooter{
				/*@editable*/ background-color:#FDFDFD;
				/*@editable*/ border-top:0;
			}
			
			/**
			* @tab Footer
			* @section footer text
			* @tip Set the styling for your email's footer text. Choose a size and color that is easy to read.
			* @theme footer
			*/
			.footerContent div{
				/*@editable*/ color:#707070;
				/*@editable*/ font-family:Arial;
				/*@editable*/ font-size:12px;
				/*@editable*/ line-height:125%;
				/*@editable*/ text-align:left;
			}
			
			/**
			* @tab Footer
			* @section footer link
			* @tip Set the styling for your email's footer links. Choose a color that helps them stand out from your text.
			*/
			.footerContent div a:link, .footerContent div a:visited{
				/*@editable*/ color:#336699;
				/*@editable*/ font-weight:normal;
				/*@editable*/ text-decoration:underline;
			}
			
			.footerContent img{
				display:inline;
			}
			
			/**
			* @tab Footer
			* @section social bar style
			* @tip Set the background color and border for your email's footer social bar.
			* @theme footer
			*/
			#social{
				/*@editable*/ background-color:#FAFAFA;
				/*@editable*/ border:0;
			}
			
			/**
			* @tab Footer
			* @section social bar style
			* @tip Set the background color and border for your email's footer social bar.
			*/
			#social div{
				/*@editable*/ text-align:center;
			}
			
			/**
			* @tab Footer
			* @section utility bar style
			* @tip Set the background color and border for your email's footer utility bar.
			* @theme footer
			*/
			#utility{
				/*@editable*/ background-color:#FDFDFD;
				/*@editable*/ border:0;
			}

			/**
			* @tab Footer
			* @section utility bar style
			* @tip Set the background color and border for your email's footer utility bar.
			*/
			#utility div{
				/*@editable*/ text-align:center;
			}
			
			#monkeyRewards img{
				max-width:190px;
			}
		</style>
	</head>
    <body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0">
    	<center>
        	<table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="backgroundTable">
            	<tr>
                	<td align="center" valign="top">
                        <!-- // Begin Template Preheader \\ -->
                        <table border="0" cellpadding="10" cellspacing="0" width="600" id="templatePreheader">
                            <tr>
                                <td valign="top" class="preheaderContent">
                                
                                	<!-- // Begin Module: Standard Preheader \ -->
                                    <table border="0" cellpadding="10" cellspacing="0" width="100%">
                                    	<tr>
                                        	<td valign="top">
                                            	<div mc:edit="std_preheader_content">
                                                	 
                                                </div>
                                            </td>
                                            <!-- *|IFNOT:ARCHIVE_PAGE|* -->
											<td valign="top" width="190">
                                            	<div mc:edit="std_preheader_links">
                                                	
                                                </div>
                                            </td>
											<!-- *|END:IF|* -->
                                        </tr>
                                    </table>
                                	<!-- // End Module: Standard Preheader \ -->
                                
                                </td>
                            </tr>
                        </table>
                        <!-- // End Template Preheader \\ -->
                    	<table border="0" cellpadding="0" cellspacing="0" width="600" id="templateContainer">
                        	<tr>
                            	<td align="center" valign="top">
                                    <!-- // Begin Template Body \\ -->
                                	<table border="0" cellpadding="0" cellspacing="0" width="600" id="templateBody">
                                    	<tr>
                                        	<td valign="top" width="70" class="leftColumnContent">
                                            
                                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                    <tr>
                                                      <td valign="top">
															<img src="<?php echo url_for("appFlowerStudioPlugin/images", true) ?>/email/logo.png" alt="logo" width="75" height="230" />
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        	<td valign="top" width="510" class="rightColumnContent">
                                            
                                                <table border="0" cellpadding="20" cellspacing="0" width="100%">
                                                    <tr>
                                                        <td valign="top">
                                                          <h1>Welcome to AppFlower Studio</h1>        
                                                          <div>
                                                          		Dear <?php echo (!empty($user['first_name']) && !empty($user['last_name'])) ? $user['first_name'] . ' ' .$user['last_name'] : $user['username'] ?>, <br />
                                                          		Your Studio Account has been successfully created. <br />
																You can now connect to your Studio profile with: <br />
																username: <strong><?php echo $user['username'] ?></strong><br/>
																password: <strong><?php echo $password ?></strong> <br />
																To get connected, go to the <?php echo link_to('login page', 'afsAuthorize/index', array('absolute' => true)) ?> and enter these codes. <br />
                                                          </div>

                                                          <div id="dotted_line"></div>
                                          
                                                          <img src="<?php echo url_for("appFlowerStudioPlugin/images", true) ?>/email/footer.png" alt="footer" width="486" height="31" />
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                    <!-- // End Template Body \\ -->
                                </td>
                            </tr>
                        	<tr>
                            	<td align="center" valign="top">
                                    <!-- // Begin Template Footer \\ -->
                                	<table border="0" cellpadding="10" cellspacing="0" width="600" id="templateFooter">
                                    	<tr>
                                        	<td valign="top" class="footerContent">
                                            
                                                <!-- // Begin Module: Standard Footer \\ -->
                                                <table border="0" cellpadding="10" cellspacing="0" width="100%">
                                                    <tr>
                                                        <td colspan="2" valign="middle" id="social">
                                                            <div mc:edit="std_social">
                                                                &nbsp;<a href="http://www.twitter.com/#!/appflower/">follow on Twitter</a> | <a href="http://www.facebook.com/#!/pages/AppFlower/180819488621554">friend on Facebook</a>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td valign="top" width="350">
                                                            <br />
                                                            <div mc:edit="std_footer">
                                                                <em>Copyright &copy; <?php echo date("Y") ?> AppFlower ApS, All rights reserved.</em>
                                                                <br />
                                                                <strong>Our mailing address is:</strong>
                                                                <br />
                                                                info@appflower.com
                                                            </div>
                                                            <br />
                                                        </td>
                                                        <td valign="top" width="190" id="monkeyRewards">
                                                            <br />
                                                            <div mc:edit="monkeyrewards">
                                                                
                                                            </div>
                                                            <br />
                                                        </td>
                                                    </tr>
                                                </table>
                                                <!-- // End Module: Standard Footer \\ -->
                                            
                                            </td>
                                        </tr>
                                    </table>
                                    <!-- // End Template Footer \\ -->
                                </td>
                            </tr>
                        </table>
                        <br />
                    </td>
                </tr>
            </table>
        </center>
    </body>
</html>
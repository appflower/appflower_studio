<?php echo stylesheet_tag('/appFlowerStudioPlugin/css/welcome.css') ?>
<?php echo stylesheet_tag('/appFlowerStudioPlugin/css/prettyPhoto.css') ?>
  
<div id="studio_popup">
    <div id="studio_popup_primary">
      <div id="popup_content">
        <h2>Welcome to AppFlower Studio</h2>
        <p>AppFlower Studio makes application development easy and fun. If you are new to AppFlower Studio, you can watch the quick introduction video above.</p>
        <a class="flowerbutton" href="http://vimeo.com/21965153" rel="prettyPhoto" title="AppFlower-003: Installing appflower vmdk on virtual box">Start</a>
      </div>
    </div>
    <div id="studio_popup_secondary">
     <div id="studio_video_tours">
      <h3>VIDEO TUTORIALS</h3>
      <ul>
      
          <?php foreach ($data as $video): ?>
            <li>
	          <img src="<?php echo $video['thumbnail_small']?>" alt="<?php echo $video['title'] ?>" width="57" height="57">
	          <div>
	            <h5><a href="<?php echo $video['url']?>" rel="prettyPhoto" title="<?php echo $video['title'] ?>"><?php echo $video['title'] ?></a></h5>
	            <p class="views"><span><?php echo $video['stats_number_of_plays']?> views</span></p>
	          </div>
	        </li>
          <?php endforeach; ?>
      
     </ul>
    </div>
    <div id="quick_links">
      <h3>QUICK LINKS</h3>
      <ul>
        <li><a href="http://www.appflower.com/forum" target="_blank">Open discussion forum</a></li>
        <li><a href="http://www.appflower.com/cms/learningcenter" target="_blank">Go to learning center</a></li>
      </ul>
    </div>
    </div>
  </div>
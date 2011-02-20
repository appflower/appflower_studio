<p>Dear <?php echo (!empty($user['first_name']) && !empty($user['last_name'])) ? $user['first_name'] . ' ' .$user['last_name'] : $user['username'] ?>,</p>

<p>A request for Studio password recovery was sent to this address.</p>    
<p>For safety reasons, the Studio does not store passwords in clear.
When you forget your password, Studio creates a new one that can be used in place.</p>

<p>You can now connect to your Studio profile with:</p>

<p>
    username: <strong><?php echo $user['username'] ?></strong><br/>
    password: <strong><?php echo $password ?></strong>
</p>

<p>To get connected, go to the <?php echo link_to('login page', 'afsAuthorize/index', array('absolute' => true)) ?> and enter these codes.</p>

<p>The Studio email robot</p>

<?php


class VimeoInstanceService
{
	private $url;
    
    public function __construct()
    {
        $user = sfConfig::get('app_vimeo_user', 'appflower');

        if ($user == '') {
            throw new Exception('You must set app_vimeo_user in app.yml');
        }
        
        if (!extension_loaded('curl')) {
            throw new Exception("Curl PHP extension is required to use VimeoInstanceService class.");
        }
        
        $this->url = 'http://vimeo.com/api/v2/'.$user.'/videos.json';
    }

    function getDataFromRemoteServer()
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, false);

        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");

        curl_setopt($ch, CURLOPT_URL, $this->url);

        $httpResult = curl_exec($ch);

        $curlError = curl_error($ch);

        if ($curlError != '') {
            throw new Exception('Curl error occured: ' . $curlError);
        }

        return json_decode($httpResult, true);
    }

}
?>

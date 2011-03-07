<?php
/**
 * afsCaptcha - studio captcha class
 *
 * @author startsev.sergey@gmail.com
 */
class afsCaptcha {

    /**
     * Default font name
     */
	const FONT = 'captcha.ttf';
    
	/**
	 * Session identificator for captcha
	 */
	const SESSION_IDENTIFICATOR = 'afs_captcha';
	
	/**
	 * Image width
	 */
	private $width;

	/**
	 * Image height
	 */
	private $height;
	
	/**
	 * Characters count
	 */
	private $characters;
	
	/**
	 * Image handler
	 */
	private $image;
	
	/**
	 * Noise color
	 */
	private $noise_color;
	
	/**
	 * Background color
	 */
	private $background_color;
	
	/**
	 * Text color
	 */
	private $text_color;
	
	/**
	 * Font size
	 */
	private $font_size;
	
	public function __construct($width = '160', $height = '50', $characters = '6')
	{
	    $this->width = $width;
	    $this->height = $height;
	    $this->characters = $characters;
	}
	
    /**
     * Generate captcha image
     */
    public function generate()
    {
		$this->font_size = $this->height * 0.75;
		$this->image = @imagecreate($this->width, $this->height);
		
        // Initialize colors
        $this->setColors();
        
        // Generate noise
        $this->generateDots();
        $this->generateLines();
        
        // Getting code
        $code = $this->generateCode();
        
        // Getting font
        $font = $this->getFont();
        
        // Preparing for writing text
        $textbox = imagettfbbox($this->font_size, 0, $font, $code);
        
        $x = ($this->width - $textbox[4]) / 2;
        $y = ($this->height - $textbox[5]) / 2;
        
        // Write text
        imagettftext($this->image, $this->font_size, 0, $x, $y, $this->text_color, $font, $code);
        
        // Sending headers etc.
        $context = sfContext::getInstance();
        
        $context->getResponse()->setContentType('image/jpeg');
        $context->getResponse()->send();
        
        // displaying generated image
        imagejpeg($this->image);
        imagedestroy($this->image);
        
        // Setting code to session - flash
        $context->getUser()->setFlash(self::SESSION_IDENTIFICATOR, $code);
    }
	
    /**
     * Initialize colors
     */
	public function setColors()
	{
	    $this->background_color = imagecolorallocate($this->image, 255, 255, 255);
		$this->text_color = imagecolorallocate($this->image, 20, 40, 100);
		$this->noise_color = imagecolorallocate($this->image, 100, 120, 180);
	}
	
	/**
	 * Generate dots procedure
	 */
	private function generateDots()
	{
	    // generate random dots in background
		for( $i = 0; $i < ($this->width * $this->height) / 3; $i++ ) {
			imagefilledellipse(  $this->image, 
			                     mt_rand(0, $this->width), 
			                     mt_rand(0, $this->height), 
			                     1, 
			                     1, 
			                     $this->noise_color
			);
		}
	}
	
	/**
	 * Generate lines procedure
	 */
	private function generateLines()
	{
	    // Generate random lines in background 
		for( $i=0; $i < ($this->width * $this->height) / 150; $i++ ) {
            imageline(  $this->image, 
                        mt_rand(0, $this->width), 
                        mt_rand(0, $this->height), 
                        mt_rand(0, $this->width), 
                        mt_rand(0, $this->height), 
                        $this->noise_color
            );
		}
	}
	
	/**
	 * Generate code
	 *
	 * @param int $characters - count of symbols
	 * @return string
	 */
	private function generateCode() 
	{
		$possible = '23456789bcdfghjkmnpqrstvwxyz';
		
		$code = '';
		$i = 0;
		
		while ($i < $this->characters) { 
			$code .= substr($possible, mt_rand(0, strlen($possible)-1), 1);
			$i++;
		}
		return $code;
	}
	
	/**
	 * Getting full font path
	 *
	 * @return string
	 */
	private static function getFont()
	{
	    return dirname(__FILE__) . '/ttf/' .self::FONT;
	}

}

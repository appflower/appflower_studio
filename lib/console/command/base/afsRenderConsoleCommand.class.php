<?php
/**
 * Console command render class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsRenderConsoleCommand
{
    /**
     * Default render tag
     */
    const DEFAULT_TAG = 'li';
    
    /**
     * Render content method 
     *
     * @param string $content 
     * @param array $attributes 
     * @param string $tag 
     * @return string
     * @author Sergey Startsev
     */
    static public function render($content, array $attributes = array(), $tag = self::DEFAULT_TAG)
    {
        $attributes_list = '';
        if (!empty($class)) {
            $attributes_list = array();
            foreach ($attributes as $key => $value) {
                $attributes_list[] = "{$key}=\"{$value}\"";
            }
            
            $attributes_list = implode(' ', $attributes_list);
        }
        
        return "<{$tag}{$attributes_list}>{$content}</{$tag}>";
    }
    
}

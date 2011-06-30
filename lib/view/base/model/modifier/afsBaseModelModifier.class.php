<?php
/**
 * Base class for edit, list and other widget types modifier classes
 * When widget definition returns from JS side it is unserialized to xml data
 *
 * @author Łukasz Wojciechowski <luwo@appflower.com>
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
abstract class afsBaseModelModifier
{
    /**
     * This method gets new widget representation created on JS side
     * It can modify it specially for concrete widget type and return modified definition
     * This class will also get information regarding if modfified widget is new widget
     *
     * @param afsBaseModel $model
     * @return afsBaseModel - modified model
     */
    abstract function modify(afsBaseModel $model);
    
}

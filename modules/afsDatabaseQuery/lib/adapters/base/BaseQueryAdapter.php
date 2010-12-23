<?php

abstract class BaseQueryAdapter
{
	public $dbh;
    
    public function __construct($dbh = null)
    {
        if ($dbh) $this->setConnection($dbh);
    }

    public function setConnection($dbh)
    {
        $this->dbh = $dbh;
    }

    public function getConnection()
    {
        return $this->dbh;
    }
}

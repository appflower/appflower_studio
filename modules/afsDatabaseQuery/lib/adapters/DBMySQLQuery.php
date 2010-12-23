<?php

/**
 * MySQL db query adapter 
 */
class DBMySQLQuery extends BaseQueryAdapter
{
	/**
	 *
	 */
	public function getTables()
	{
		$stmt = $this->dbh->query("SHOW TABLES");
        
		$tables = array();
		while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
			$tables[] = $row[0];
		}
		
        return $tables;
	}

}

<?php

/**
 * MSSQL db query adapter 
 */
class DBMSSQLQuery extends BaseQueryAdapter
{
	/**
	 *
	 */
	public function getTables()
	{
		$stmt = $this->dbh->query("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_NAME <> 'dtproperties'");

		$tables = array();
		while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
			$tables[] = $row[0];
		}
        
		return $tables;
	}

}

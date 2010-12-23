<?php

/**
 * SQLite db query adapter 
 */
class DBSQLiteQuery extends BaseQueryAdapter
{
    /**
     * 
     */
	public function getTables()
	{
		$stmt = $this->dbh->query("SELECT name FROM sqlite_master WHERE type='table' UNION ALL SELECT name FROM sqlite_temp_master WHERE type='table' ORDER BY name;");

		$tables = array();
		while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
			$tables[] = $row[0];
		}
		
		return $tables;
	}

}

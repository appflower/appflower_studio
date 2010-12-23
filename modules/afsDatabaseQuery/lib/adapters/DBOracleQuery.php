<?php

/**
 * Oracle db query adapter 
 */
class DBOracleQuery extends BaseQueryAdapter
{
    /**
     * 
     */
	public function getTables()
	{
		$tables = array();
		$stmt = $this->dbh->query("SELECT OBJECT_NAME FROM USER_OBJECTS WHERE OBJECT_TYPE = 'TABLE'");
		
		while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
			if (strpos($row['OBJECT_NAME'], '$') !== false) {
				// this is an Oracle internal table or materialized view - prune
				continue;
			}
			$tables[] = $row['OBJECT_NAME'];
		}

		return $tables;
	}

}


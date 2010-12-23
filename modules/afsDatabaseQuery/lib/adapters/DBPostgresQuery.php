<?php

/**
 * Postgre db query adapter 
 */
class DBPostgresQuery extends BaseQueryAdapter
{
    /**
     * 
     */
	public function getTables()
	{
		$stmt = $this->dbh->query("SELECT c.oid,
								    case when n.nspname='public' then c.relname else n.nspname||'.'||c.relname end as relname
								    FROM pg_class c join pg_namespace n on (c.relnamespace=n.oid)
								    WHERE c.relkind = 'r'
								      AND n.nspname NOT IN ('information_schema','pg_catalog')
								      AND n.nspname NOT LIKE 'pg_temp%'
								      AND n.nspname NOT LIKE 'pg_toast%'
								    ORDER BY relname");

		$tables = array();

		while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
			$tables[] = $row['relname'];
		}

		return $tables;
	}
}

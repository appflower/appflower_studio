<?php

class afsDbInfo {
  public $tables = array();
  public $debug = true;
  private $_diffSqlPre = null;
  private $_diffSql = null;
  private $_diffSqlSuc = null;
  
  function loadFromDb($con) {
    $stmt = $con->prepare("SHOW FULL TABLES");
    $stmt->execute();
    $stmt->setFetchMode(PDO::FETCH_NUM);

    if($stmt->rowCount()==0) return false;
    while($row = $stmt->fetch()) {
        if(strtoupper($row[1])=="BASE TABLE") {
            $this->tables[$row[0]] = array();
        }
    };
    foreach($this->tables as $table => $null) {
          $stmt = $con->prepare("show create table `".$table."`");
          $stmt->execute();
          $row = $stmt->fetch();
          $create_table = $row[1];
          $this->getTableInfoFromCreate($create_table);
    }

    return true;
  }
  
  function loadFromDbForTables($con, $tables) {
    $stmt = $con->prepare("SHOW FULL TABLES");
    $stmt->execute();
    $stmt->setFetchMode(PDO::FETCH_NUM);

    if($stmt->rowCount()==0) return false;
    while($row = $stmt->fetch()) {
        if(strtoupper($row[1])=="BASE TABLE") {
        	if(!in_array($row[0], $tables)) continue;
            $this->tables[$row[0]] = array();
        }
    };
    foreach($this->tables as $table => $null) {
    	  if(!in_array($table, $tables)) continue;
          $stmt = $con->prepare("show create table `".$table."`");
          $stmt->execute();
          $row = $stmt->fetch();
          $create_table = $row[1];
          $this->getTableInfoFromCreate($create_table);
    }

    return true;
  }

  public function loadFromFile($filename) {
    $dump = file_get_contents($filename);
    preg_match_all('/create table ([^\'";]+|\'[^\']*\'|"[^"]*")+;/i', $dump, $matches);
    foreach($matches[0] as $key=>$value) {
        $this->getTableInfoFromCreate($value);
    }
  }

  public function loadAllFilesInDir($dir) {
    $files = sfFinder::type('file')->name('*.schema.sql')->follow_link()->in($dir);
    foreach($files as $file) $this->loadFromFile($file);
  }

  public function getTableInfoFromCreate($create_table) {
    preg_match("/^\s*create table `?([^\s`]+)`?\s+\((.*)\)([^\)]*)$/mis", $create_table, $matches);
    $table = $matches[1];
    $code = $matches[2];
    $table_info = $matches[3];

    $this->tables[$table]['create'] = $create_table;
    $this->tables[$table]['fields'] = array();
    $this->tables[$table]['keys'] = array();
    $this->tables[$table]['fkeys'] = array();
    
    if(preg_match('/type=(\w+)/i', $table_info, $matches)) {
        $this->tables[$table]['type'] = strtolower($matches[1]);
    } else {
        $this->tables[$table]['type'] = '';
    }
    preg_match_all('/\s*(([^,\'"\(]+|\'[^\']*\'|"[^"]*"|\(([^\(\)]|\([^\(\)]*\))*\))+)\s*(,|$)/', $code, $matches);
    foreach($matches[1] as $key=>$value) {
      $this->getInfoFromPart($table, trim($value));
    }
  }

  public function getInfoFromPart($table, $part) {
    //get fields codes
    
    if(preg_match("/^`(\w+)`\s+(.*)$/m", $part, $matches)) {
      $fieldname = $matches[1];
      $code = $matches[2];
      $unsigned = 0;
      $this->tables[$table]['fields'][$fieldname]['code'] = $code;
      
      preg_match('/([^\s]+)\s*(NOT NULL)?\s*(default (\'([^\']*)\'|(\d+)))?\s*(NOT NULL)?/i', $code, $matches2);
      $type = strtoupper($matches2[1]);
      switch ($type) {
          case 'TINYINT' : $type = 'TINYINT(4)'; break;
          case 'SMALLINT' : $type = 'SMALLINT(6)'; break;
          case 'INTEGER' : $type = 'INT(11)'; break;
          case 'BIGINT' : $type = 'BIGINT(20)'; break;
          case 'BLOB' : $type = 'TEXT';  break;   //propel fix, blob is TEXT field with BINARY collation 
          default: 
      }
      if (strpos($type, 'INT') !== false && stripos($part, 'unsigned', 5)) {
          $unsigned = 1; // TODO: if unsigned is in the comment then this will trigger it too.
      }
      
      $type = str_replace('VARBINARY', 'VARCHAR', $type);
      $this->tables[$table]['fields'][$fieldname] = array(
        'code'    => $code,
        'type'    => $type,
        'unsigned' => $unsigned,
		'null'    => ((!isset($matches2[2]) || $matches2[2] != "NOT NULL") && (!isset($matches2[7]) || $matches2[7] != "NOT NULL")),
		'default' => !empty($matches2[5]) ? $matches2[5] : ( !empty($matches2[6]) ? $matches2[6] : ''), 
      );
    }

    //get key codes
    elseif(preg_match("/^(primary|unique|fulltext)?\s*(key|index)\s+(`(\w+)`\s*)?(.*?)$/mi", $part, $matches)) {
      $keyname = $matches[4];
      $this->tables[$table]['keys'][$keyname]['type'] = $matches[1];
      $this->tables[$table]['keys'][$keyname]['code'] = $matches[5];
      $this->tables[$table]['keys'][$keyname]['fields'] = preg_split('/,\s*/', substr($matches[5], 1, -1));
    }
// now, it is important to see if the local key types match the remote key types
    elseif(preg_match("/CONSTRAINT\s+\`(.+)\`\s+FOREIGN KEY\s+\(\`(.+)\`\)\s+REFERENCES \`(.+)\` \(\`(.+)\`\)/mi", $part, $matches)) {
      $name = $matches[1];
      $this->tables[$table]['fkeys'][$name] = array(
						'field' => $matches[2],
						'ref_table' => $matches[3],
						'ref_field' => $matches[4],
						'code' => $part,
      );
      if(preg_match('/ON DELETE (RESTRICT|CASCADE|SET NULL|NO ACTION)/i', $part, $matches)) {
        $this->tables[$table]['fkeys'][$name]['on_delete'] = strtoupper($matches[1]);
      } else {
        $this->tables[$table]['fkeys'][$name]['on_delete'] = 'RESTRICT';
      }
      if(preg_match('/ON UPDATE (RESTRICT|CASCADE|NO ACTION)/i', $part, $matches)) {
        $this->tables[$table]['fkeys'][$name]['on_update'] = strtoupper($matches[1]);
      } else {
        $this->tables[$table]['fkeys'][$name]['on_update'] = 'RESTRICT';
      }
    }

    else {
      throw new Exception("can't parse line '$part' in table $table");
    }
  }
  
/**
 * This function checks if a foreign key'd column matches the foreign table's column type
 * If they don't match then it drops the foreign key and sets the foreign key'd column's type 
 * to the foreign table's column type and then adds back the foreign key. This is a solution
 * I made this to fix mismatched column types that stopped fkeys from being created.
 * Use at your own risk as I've only tested this on my db.
 *
 * @author Jeck Lamnent
 * @since 17.07.09 11:41
 * @param dbInfo $db_info2
 */
public function checkForeignKeys(&$db_info2) {
      # Choose one of the below 
      
      $compareTo = &$this; // this will fix foreign key mismatches in an existing in a db
      //$compareTo = &$db_info2; // this will only fix mismatches in the schema.yml copy
    
      # 1) Check which tables we have
      foreach ($compareTo -> tables as $childTableName => &$currentTable) {
          if (isset($currentTable['create'])) {
              if (!empty($currentTable['fkeys'])) { // if fkey exists
                  # Check all foreign keys of this table
                  foreach ($currentTable['fkeys'] as $fkeyName => &$fkey) {
                      $fkeyTableName = &$fkey['ref_table']; // the foreign table's name
                      $fkeyColumnName = &$fkey['ref_field']; // the foreign column's name
                      # Get main table
                      $foreignTable = &$compareTo -> tables[$fkeyTableName]; // get the foreign table
                      if (!empty($foreignTable['create'])) {
                          $childColumn = &$currentTable['fields'][$fkey['field']]; // our local column to fix
                          # From schema
                          $schemaParentColumn = &$db_info2 -> tables[$fkeyTableName]['fields'][$fkeyColumnName]; // column in foreign table
                          # See if column warrants a change
                          if ($schemaParentColumn['type'] != $childColumn['type'] || $schemaParentColumn['unsigned'] != $childColumn['unsigned']) {
                             // echo "*fkey: column different than fkey table: $childTableName.{$fkey['field']}:{$childColumn['type']}\n";
                              # Change damaged type/unsigned to foreign table's 
                              if($this->debug) {
                                  $this -> _diffSqlPre .= "/* fkey dropped to fix column type */\n";
                              }
                              $this -> _diffSqlPre .= "ALTER TABLE `$childTableName` DROP FOREIGN KEY `$fkeyName`;\n";
                              
                              # Change the schema's code for the column were fixing so sql gets built
                              $schemaChildColumn = &$db_info2 -> tables[$childTableName]['fields'][$fkey['field']]; // column in foreign table
                              
                              $schemaChildColumn['fkey_fixed'] = 1;
                              $schemaChildColumn['type'] = $schemaParentColumn['type'];
                              $schemaChildColumn['unsigned'] = $schemaParentColumn['unsigned'];
                              $childColumn = &$schemaChildColumn;
                              
                              $newCode = str_replace(array_pad(array(), 3, '  '), ' ', $schemaParentColumn['code']); // remove extra double spaces

                              # remove auto_increment
                              $newCode = str_ireplace('AUTO_INCREMENT', null, $newCode);
                              # Copy primary key
                              if (stripos($childColumn['code'], 'primary key') !== false && stripos($newCode, 'primary key') === false) {
                                  $newCode .= ' PRIMARY KEY ';
                              } 
                              # Copy null
                              $bFoundChildNull = (stripos($childColumn['code'], 'null') === false);
                              $bFoundChildNotNull = (stripos($childColumn['code'], 'not null') === false);
                              $bFoundSchemaNull = (stripos($newCode, 'null') === false);
                              $bFoundSchemaNotNull = (stripos($newCode, 'not null') === false);
                              
                              if ($bFoundChildNotNull) {
                                  if (!$bFoundSchemaNull) { //not null
                                    $newCode .= ' NOT NULL ';
                                  } else {
                                      if (!$bFoundSchemaNotNull) { // convert null to not null
                                          $newCode = str_ireplace('null', 'NOT NULL', $newCode);
                                      }
                                  }
                              } elseif ($bFoundChildNull) { //null
                                  if ($bFoundSchemaNotNull) {
                                      $newCode = str_ireplace('not null', 'NULL', $newCode);
                                  } else {
                                      if (!$bFoundSchemaNull) { // convert null to not null
                                          $newCode .= ' NULL ';
                                      }
                                  }
                              } else {
                                  if ($bFoundSchemaNotNull) {
                                      $newCode = str_ireplace('not null', null, $newCode);
                                  } else {
                                      if ($bFoundSchemaNotNull) {
                                      $newCode = str_ireplace('null', null, $newCode);
                                  }
                                  }
                              }
                                  
                              # Copy / replace comment
                              if (stripos($childColumn['code'], 'comment') !== false) {
                                  if (preg_match('/comment[ ]*[=]?[ ]*[\'"](.*)[\'"]/i', $childColumn['code'], $matches)) {
                                      $newCode = preg_replace('/comment[ ]*[=]?[ ]*[\'"](.*)[\'"]/i', $matches[0], $newCode);
                                  }
                              }
                              
                              //$schemaChildColumn['code'] = $newCode;
                              $childColumn['code'] = $newCode;
                              
                              if($this->debug) {
                                  $this -> _diffSqlSuc .= "/* fkey added to fix column type */\n";
                              }
                              $this -> _diffSqlSuc .= "ALTER TABLE `$childTableName` ADD {$fkey['code']};\n";
                          }
                      }
                  } // END foreach fkey
              } // END !empty fkeys
          } // END isset create
      } // END foreach tables
    //  echo '</pre><hr/>';
  }
  
  function tableSupportsFkeys($tabletype) {
      return !in_array($tabletype, array('myisam', 'ndbcluster'));
  }

    private function addNewColumns(&$tabledata, $tablename) {
        $diff_sql = &$this -> _diffSql;
        foreach($tabledata['fields'] as $field=>$fielddata) {
            $mycode = $fielddata['code'];
            $othercode = @$this->tables[$tablename]['fields'][$field]['code'];
            if($mycode and !$othercode) {
                $diff_sql .= "ALTER TABLE `$tablename` ADD `$field` $mycode;\n";
            };
        };
    }
  
    private function addNewRegularKeys(&$tabledata, $tablename) {
        $diff_sql = &$this -> _diffSql;
        if($tabledata['keys']) foreach($tabledata['keys'] as $field=>$fielddata) {
            $mycode = $fielddata['code'];
            $otherdata = @$this->tables[$tablename]['keys'][$field];
            $othercode = @$otherdata['code'];
            if($mycode and !$othercode) {
                if($otherdata['type']=='PRIMARY') {
                    $diff_sql .= "ALTER TABLE `$tablename` ADD PRIMARY KEY $mycode;\n";
                } else {
                    $diff_sql .= "ALTER TABLE `$tablename` ADD {$fielddata['type']} INDEX `$field` $mycode;\n";
                }
            };
        };
    }
    
    private function addNewForeignKeys(&$tabledata, $tablename) {
        if($tabledata['fkeys'] && $this->tableSupportsFkeys($tabledata['type'])) {
            foreach($tabledata['fkeys'] as $fkeyname=>$data) {
                $mycode = $data['code'];
                $otherfkname = $this->get_fk_name_by_field($tablename, $data['field']);
                $othercode = @$this->tables[$tablename]['fkeys'][$otherfkname]['code'];
                if($mycode && !$othercode) {
                    $this -> _diffSqlSuc .= "ALTER TABLE `$tablename` ADD {$mycode};\n";
                };
            }
        };
    }
    
    private function dropOrChangeForeignKeys(&$tabledata, &$db_info2, $tablename) {
        $diff_sql = &$this -> _diffSql;
        if(!empty($tabledata['fkeys']) && $this->tableSupportsFkeys($tabledata['type'])) {  //!!Jeck wrapped with not emptys
        foreach($tabledata['fkeys'] as $fkeyname=>$data) {
          $mycode = $data['code'];
          $otherfkname = $db_info2->get_fk_name_by_field($tablename, $data['field']);
          $othercode = @$db_info2->tables[$tablename]['fkeys'][$otherfkname]['code'];
          # Remove deleted fkeys
          if($mycode and !$othercode) {
            $diff_sql .= "ALTER TABLE `$tablename` DROP FOREIGN KEY `$fkeyname`;\n";
          } else {
            # Update foreign keys
            $data2 = $db_info2->tables[$tablename]['fkeys'][$otherfkname];
            if ($data['ref_table'] != $data2['ref_table'] ||
            $data['ref_field'] != $data2['ref_field'] ||
            $data['on_delete'] != $data2['on_delete'] ||
            $data['on_update'] != $data2['on_update']) {
              if($this->debug) {
                $diff_sql .= "/* old definition: $mycode\n   new definition: $othercode */\n";
              }
              $this -> _diffSqlPre .= "ALTER TABLE `$tablename` DROP FOREIGN KEY `$fkeyname`;\n";
              $this -> _diffSqlSuc .= "ALTER TABLE `$tablename` ADD {$othercode};\n";
              
            }
          };
        };
      }
    }
  private function dropDeletedTables(&$db_info2, $tablename) {
        if(!isset($db_info2->tables[$tablename])) {
            $this -> _diffSqlPre .= "DROP TABLE IF EXISTS `$tablename`;\n";
            return 1;
        }
    }
  function getDiffWith(afsDbInfo $db_info2) {

    $diff_sql = &$this -> _diffSql;

    foreach($db_info2->tables as $tablename=>$tabledata) {
      # Check if table exists
      if(!isset($this->tables[$tablename])) {
        $diff_sql .= "\n".$db_info2->tables[$tablename]['create']."\n";
        continue;
      }
      # Check if fields exist
      $this -> addNewColumns($tabledata, $tablename);
      # Check if keys exist
      $this -> addNewRegularKeys($tabledata, $tablename);
      # Check if foreign keys exist
      $this -> addNewForeignKeys($tabledata, $tablename);
    }
    
    foreach($this->tables as $tablename=>$tabledata) {
        # Handle deleted tables
        if ($this -> dropDeletedTables($db_info2, $tablename)) {
            continue;
        }
        # Check whether to Drop or Change Fkeys
        $this -> dropOrChangeForeignKeys($tabledata, $db_info2, $tablename);
  
      //drop, alter index
      if(!empty($tabledata['keys'])) foreach($tabledata['keys'] as $field=>$fielddata) { //!!Jeck wrapped with ! empty
        $otherdata = @$db_info2->tables[$tablename]['keys'][$field];
        $ind_name = @$otherdata['type']=='PRIMARY'?'PRIMARY KEY':"{$otherdata['type']} INDEX";
        if($fielddata['code'] and !$otherdata['code']) {
          if($fielddata['type']=='PRIMARY') {
            $diff_sql .= "ALTER TABLE `$tablename` DROP PRIMARY KEY;\n";
          } else {
            $diff_sql .= "ALTER TABLE `$tablename` DROP INDEX $field;\n";
          }
        } elseif($fielddata['fields'] != $otherdata['fields'] or $fielddata['type']!=$otherdata['type']) {
          if($this->debug) {
            $diff_sql .= "/* old definition: {$fielddata['code']}\n   new definition: {$otherdata['code']} */\n";
          }
          if($fielddata['type']=='PRIMARY') {
            $diff_sql .= "ALTER TABLE `$tablename` DROP PRIMARY KEY,";
          } else {
            $diff_sql .= "ALTER TABLE `$tablename` DROP INDEX $field,";
          }
          $diff_sql .= "        ADD $ind_name ".($field?"`$field`":"")." {$otherdata['code']};\n";
        };
      };

      //drop, alter field
      if (!empty($tabledata['fields'])) { //!!Jeck
          foreach($tabledata['fields'] as $field=>$fielddata) {
            $mycode = $fielddata['code'];
            $otherdata = @$db_info2->tables[$tablename]['fields'][$field];
            if ($othercode = @$otherdata['code']);
                
            if($mycode and !$othercode) {
              $diff_sql .= "ALTER TABLE `$tablename` DROP `$field`;\n";
            } elseif(
                $fielddata['type'] != $otherdata['type'] // !!Jeck - removed duplicate, changed to unsigned
            or $fielddata['null'] != $otherdata['null']
            or $fielddata['unsigned'] != $otherdata['unsigned']
            or $fielddata['default'] != $otherdata['default']   ) {
              if($this->debug) {
                if ($fielddata['unsigned'] != $otherdata['unsigned'] && // !!Jeck added unsigned
                    $fielddata['default'] == $otherdata['default'] &&
                    $fielddata['null'] == $otherdata['null'] &&
                    $fielddata['type'] == $otherdata['type']
                ) {
                    $diff_sql .= "/* ----- UNSIGNED CHANGE ---- */ \r\n";
                }
                $diff_sql .= "/* old definition: $mycode\n   new definition: $othercode */\n";
                if (isset($fielddata['fkey_fixed'])) {
                    $diff_sql = "/* column altered to fix foreign key */\n";
                }
              }
      
              $diff_sql .= "ALTER TABLE `$tablename` CHANGE `$field` `$field` $othercode;\n";
            };
           
          };
      } 
    };

    return $this -> _diffSqlPre . $diff_sql . $this -> _diffSqlSuc;
  }

  private function get_fk_name_by_field($tablename, $fieldname) {
    if(!empty($this->tables[$tablename]['fkeys'])) { //!!Jeck - changed to empty
      foreach($this->tables[$tablename]['fkeys'] as $fkeyname=>$data) {
        if($data['field'] == $fieldname) return $fkeyname;
      }
    };
    return null;
  }
  
  public function executeSql($sql, $connection) {
  	$queries = $this->explodeSql($sql);
  	foreach($queries as $query) {
  	  $this->executeQuery($query, $connection);
  	}
  }
  
  public function explodeSql($sql) {
    $result = array();
    preg_match_all('/([^\'";]+|\'[^\']*\'|"[^"]*")+;/i', $sql, $matches);
    foreach($matches[0] as $query) {
      $result[] = $query;
    }
    return $result;    
  }
  
  public function executeQuery($query, $connection) {
    $stmt = $connection->prepare($query);
    $stmt->execute();
    return $stmt;
  }
  
  public static function getTableNamesFromFile($filename) {
  	$tables = array();
    $dump = file_get_contents($filename);
    preg_match_all('/create table ([^\'";]+|\'[^\']*\'|"[^"]*")+;/i', $dump, $matches);
    foreach($matches[0] as $key=>$value) {
        preg_match("/^\s*create table `?([^\s`]+)`?\s+\((.*)\)([^\)]*)$/mis", $value, $matches);
    	$table = $matches[1];
    	$tables[] = $table;
    }
    return $tables;
  }
  
	public function generateDropTables($tables) {
		$sql = '';
		foreach ($tables as $tablename) {
            $sql .= "DROP TABLE IF EXISTS `$tablename`;\n";
        }
        return $sql;
    }
  
};
?>
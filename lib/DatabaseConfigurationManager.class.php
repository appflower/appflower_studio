<?php
/**
 * Class configures database connection settings in databases.yml
 * Class create/edit databases.yml
 *
 * @author zbynios
 */
class DatabaseConfigurationManager {

    static $defaultDatabaseTemplate = array(
        'dev' => array(
            'propel' => array(
                'param' => array(
                    'classname' => 'DebugPDO'
                )
            )
        ),
        'test' => array(
            'propel' => array(
                'param' => array(
                    'classname' => 'DebugPDO'
                )
            )
        ),
        'all' => array(
            'propel' => array(
                'class' => 'sfPropelDatabase',
                'param' => array(
                    'classname'  => 'PropelPDO',
                    'dsn'        => 'mysql:dbname=;host=;port=',
                    'username'   => '',
                    'password'   => '',
                    'encoding'   => 'utf8',
                    'persistent' => 'true',
                    'pooling'    => 'true'
                )

            )
        )
    );

    private $databaseConfFilePath;
    private $databaseConfTemplate;
    private $params;


    public function __construct($filePath = false) {
        $this->databaseConfFilePath = (!$filePath)?afStudioUtil::getConfigDir() . '/databases.yml':$filePath;

        $this->setDatabaseConfTemplate();
    }

    private function setDatabaseConfTemplate()
    {
        if(file_exists($this->databaseConfFilePath)) {
            // maybe add check if yml file
            $this->databaseConfTemplate = $this->loadYaml($this->databaseConfFilePath);
        } else {
            $this->databaseConfTemplate = self::$defaultDatabaseTemplate;
        }
    }


    public function setDatabaseConnectionParams($params)
    {
        $this->params = $params;
    }

    public function getDatabaseConnectionParams()
    {
        $param = $this->databaseConfTemplate['all']['propel']['param'];

        $data = array(
          'username'   => $param['username'],
          'password'   => $param['password'],
          'persistent' => $param['persistent'],
          'pooling'    => $param['pooling']
        );

        $this->getDsnParams($param['dsn'], $data);

        return $data;
    }

    private function loadYaml($filePath)
    {
        $sfYaml = new sfYaml();
        $fileData = $sfYaml->load($filePath);

        return $fileData;
    }

    private function dumpYaml($data)
    {
        $sfYaml = new sfYaml();
        $yamlData = $sfYaml->dump($data, 4);

        return $yamlData;
    }

    public function save()
    {
        $confData = $this->databaseConfTemplate;

        $param = &$confData['all']['propel']['param'];

        $param['dsn']        = $this->buildDsn($confData['all']['propel']['param']['dsn']);
        $param['username']   = $this->params['username'];
        $param['password']   = $this->params['password'];
        $param['persistent'] = (isset($this->params['persistent']) ? true : false);
        $param['pooling']    = (isset($this->params['pooling']) ? true : false);

        afStudioUtil::writeFile($this->databaseConfFilePath, $this->dumpYaml($confData));
        
        afsNotificationPeer::log('Database Settings have been modified','afStudioConf');
        
        if(is_readable($this->databaseConfFilePath))
        {
          $result = true;
        }
        else {
          $result = false;
        }
		
        return $result;
    }

    private function getDsnParams($dsn, &$data)
    {
        $dsnTemp = explode(';', $dsn);
        foreach($dsnTemp as $dsnPart) {
            $parameter = explode('=', $dsnPart);

            if(strpos($parameter[0], 'dbname') !== false) {
                $data['database'] = $parameter[1];
            }

            if(strpos($parameter[0], 'host') !== false) {
                $data['host'] = $parameter[1];
            }

            if(strpos($parameter[0], 'port') !== false) {
                $data['port'] = $parameter[1];
            }
        }
    }

    private function buildDsn($dsn)
    {
        $dsnTemp = explode(';', $dsn);
        foreach($dsnTemp as $dsnPart) {
            $parameter = explode('=', $dsnPart);

            if(strpos($parameter[0], 'dbname') !== false) {
                $dbnameKey = $parameter[0]; //f.e: mysql:dbname
            }

            $dsnParams[$parameter[0]] = $parameter[1];
        }

        $dsnParams[$dbnameKey] = $this->params['database'];
        $dsnParams['host'] = $this->params['host'];
        $dsnParams['port'] = $this->params['port'];

        foreach($dsnParams as $key => $value) {
            $parts[] = $key . '=' . $value;
        }

        return implode(';', $parts);
    }
}
?>
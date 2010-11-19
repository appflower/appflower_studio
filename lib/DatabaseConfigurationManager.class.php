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
                    'dsn'        => 'mysql:dbname=_DBNAME_;host=_HOST_;port=_PORT_',
                    'username'   => '_USERNAME_',
                    'password'   => '_PASSWORD_',
                    'encoding'   => 'utf8',
                    'persistent' => 'true',
                    'pooling'    => 'true'
                )

            )
        )
    );

    private $databaseConfFilePath;
    private $params;


    public function __construct() {
        $this->databaseConfFilePath = afStudioUtil::getConfigDir() . '/' . 'databases.yml';
    }

    public function setDatabaseConnectionParams($params)
    {
        $this->params = $params;
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
        $yamlData = $sfYaml->dump($data);

        return $yamlData;
    }

    public function save()
    {
        if(file_exists($this->databaseConfFilePath)) {
            // maybe add check if yml file
            $confData = $this->loadYaml($this->databaseConfFilePath);
        } else {
            $confData = self::$defaultDatabaseTemplate;
        }    

        $param = &$confData['all']['propel']['param'];

        $param['dsn']        = $this->buildDsn($confData['all']['propel']['param']['dsn']);
        $param['username']   = $this->params['username'];
        $param['password']   = $this->params['password'];
        $param['persistent'] = (isset($this->params['persistent']) ? 'true' : 'false');
        $param['pooling']    = (isset($this->params['pooling']) ? 'true' : 'false');

        //temporary commented, modiefies project config/databases.yml
        // I'm not sure if it ok, beacause if someone changes settings we could have problem with login
        $result = false;//@file_put_contents($this->databaseConfFilePath, $this->dumpYaml($confData));

        return $result;
    }

    private function buildDsn($dsn)
    {
        $dsnTemp = explode(';', $dsn);
        foreach($dsnTemp as $dsnPart) {
            $parameter = explode('=', $dsnPart);

            if(preg_match('/dbname/', $parameter[0])) {
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
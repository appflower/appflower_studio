<?php
/**
 * Generate All Widget task
 *
 * @package     appFlowerStudio
 * @subpackage  task
 * @author      Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsGenerateWidgetAllTask extends afsBaseGenerateTask
{
    /**
     * Current task name
     *
     * @var string
     */
    protected $task_name = 'afsGenerateWidgetAllTask';
    
    /**
     * @see sfTask
     */
    protected function configure()
    {
        $this->addOptions(array(
            new sfCommandOption('type', 'k', sfCommandOption::PARAMETER_OPTIONAL, 'Type of widget', 'list,edit,show'),
            new sfCommandOption('refresh', 'r', sfCommandOption::PARAMETER_OPTIONAL, 'Should be widget refreshed/rewritten if already exists', false),
        ));
        
        $this->namespace = 'afs';
        $this->name = 'generate-widget-all';
        $this->briefDescription = 'Creates new widget for all existing models';
        
        $this->detailedDescription = <<<EOF
The [afs:generate-widget-all|INFO] task generate widgets:

  [./symfony afs:generate-widget-all|INFO]
EOF;
    }
    
    /**
     * @see sfTask
     */
    protected function execute($arguments = array(), $options = array())
    {
        $types = $options['type'];
        $refresh = $options['refresh'];
        
        $models = afStudioCommand::process('model', 'get')->getParameter(afResponseDataDecorator::IDENTIFICATOR_DATA);
        
        foreach ($models as $model) {
            $this->logSection('model', $model['text']);
            $this->createTask('afs:generate-widget')->run(array(), array(
                'model'     => $model['text'],
                'type'      => $types,
                'refresh'   => $refresh,
            ));
        }
    }
    
}

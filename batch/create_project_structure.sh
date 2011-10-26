#!/bin/sh

CURRENT_DIR=$(pwd)
cd $CURRENT_DIR/../
PROJECT_DIR=$(pwd)

TARGET_DIR=$1
PROJECT_YML_FILE=$2
DATABASES_YML_FILE=$3
USERS_YML_FILE=$4
DATABASE_EXIST=$5
DB_NAME=$6
DB_HOST=$7
DB_PORT=$8
DB_USER=$9
DB_PASS=${10}

echo Cloning current project into target directory
$PROJECT_DIR/plugins/appFlowerStudioPlugin/batch/cloneLocalGitRepository.php $PROJECT_DIR $TARGET_DIR vm-image || exit 1

if [ -e $PROJECT_YML_FILE ]; then
	cp $PROJECT_YML_FILE $TARGET_DIR/config/project.yml
	rm -rf $PROJECT_YML_FILE
fi

if [ -e $DATABASES_YML_FILE ]; then
	cp $DATABASES_YML_FILE $TARGET_DIR/config/databases.yml
	rm -rf $DATABASES_YML_FILE
fi

if [ -e $USERS_YML_FILE ]; then
	cp $USERS_YML_FILE $TARGET_DIR/plugins/appFlowerStudioPlugin/config/users.yml
	rm -rf $USERS_YML_FILE
fi

if [ "$DATABASE_EXIST" = "1" ]; then
  echo Database $DB_NAME already exist and will be overwritten with an empty one
  echo Dropping database $DB_NAME
  mysqladmin -u$DB_USER -p$DB_PASS --host=$DB_HOST --port=$DB_PORT -f drop $DB_NAME

  echo Creating database $DB_NAME
  mysqladmin -u$DB_USER -p$DB_PASS --host=$DB_HOST --port=$DB_PORT create $DB_NAME

  echo Setting database $DB_NAME to UTF8 encoding
  echo "ALTER DATABASE $DB_NAME DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;" | mysql -u $DB_USER -p$DB_PASS $DB_NAME -h$DB_HOST -P$DB_PORT
else
  echo Database $DB_NAME does not exist and will be created
  echo Creating database $DB_NAME
  mysqladmin -u$DB_USER -p$DB_PASS --host=$DB_HOST --port=$DB_PORT create $DB_NAME

  echo Setting database $DB_NAME to UTF8 encoding
  echo "ALTER DATABASE $DB_NAME DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;" | mysql -u $DB_USER -p$DB_PASS $DB_NAME -h$DB_HOST -P$DB_PORT
fi

echo Running insert-sql task
$TARGET_DIR/symfony propel:insert-sql --no-confirmation

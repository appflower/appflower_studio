#!/bin/sh

CURRENT_DIR=$(pwd)
TARGET_DIR=$1
FETCH_LATEST_TGZ=$2
PROJECT_YML_FILE=$3
DATABASES_YML_FILE=$4
USERS_YML_FILE=$5
DATABASE_EXIST=$6
DB_NAME=$7
DB_HOST=$8
DB_PORT=$9
DB_USER=${10}
DB_PASS=${11}

cd $CURRENT_DIR/../
CURRENT_DIR=$(pwd)
SKELETON_FILE=$CURRENT_DIR/plugins/appFlowerStudioPlugin/data/skeleton.tgz

mkdir -p $CURRENT_DIR/plugins/appFlowerStudioPlugin/data/

echo Fetching skeleton.tgz if needed
if [ "$FETCH_LATEST_TGZ" = "1" ]; then
	rm -rf $SKELETON_FILE
    wget -q --directory-prefix="$CURRENT_DIR/plugins/appFlowerStudioPlugin/data/" http://www.appflower.com/uploads/skeleton.tgz
else
    if [ -e $SKELETON_FILE ]; then
		wget -q --directory-prefix="/tmp/" http://www.appflower.com/uploads/skeleton.tgz
		
		if `diff $SKELETON_FILE /tmp/skeleton.tgz >/dev/null` ; then
		  rm -rf /tmp/skeleton.tgz
		else
		  rm -rf $SKELETON_FILE
		  cp -pR /tmp/skeleton.tgz $SKELETON_FILE
		fi
	else 
	    rm -rf $SKELETON_FILE
		wget -q --directory-prefix="$CURRENT_DIR/plugins/appFlowerStudioPlugin/data/" http://www.appflower.com/uploads/skeleton.tgz
	fi
fi

echo Creating new project from skeleton
mkdir -p $TARGET_DIR
cd /tmp
tar xzpf $SKELETON_FILE
mv /tmp/skeleton/* $TARGET_DIR
rm -rf /tmp/skeleton
mkdir -p $TARGET_DIR/plugins/appFlowerStudioPlugin/data/
cp $SKELETON_FILE $TARGET_DIR/plugins/appFlowerStudioPlugin/data/
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

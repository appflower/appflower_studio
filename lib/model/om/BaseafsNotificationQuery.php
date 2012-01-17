<?php


/**
 * Base class that represents a query for the 'afs_notification' table.
 *
 * 
 *
 * @method     afsNotificationQuery orderByMessage($order = Criteria::ASC) Order by the message column
 * @method     afsNotificationQuery orderByMessageType($order = Criteria::ASC) Order by the message_type column
 * @method     afsNotificationQuery orderByUser($order = Criteria::ASC) Order by the user column
 * @method     afsNotificationQuery orderByIp($order = Criteria::ASC) Order by the ip column
 * @method     afsNotificationQuery orderByCreatedAt($order = Criteria::ASC) Order by the created_at column
 * @method     afsNotificationQuery orderById($order = Criteria::ASC) Order by the id column
 *
 * @method     afsNotificationQuery groupByMessage() Group by the message column
 * @method     afsNotificationQuery groupByMessageType() Group by the message_type column
 * @method     afsNotificationQuery groupByUser() Group by the user column
 * @method     afsNotificationQuery groupByIp() Group by the ip column
 * @method     afsNotificationQuery groupByCreatedAt() Group by the created_at column
 * @method     afsNotificationQuery groupById() Group by the id column
 *
 * @method     afsNotificationQuery leftJoin($relation) Adds a LEFT JOIN clause to the query
 * @method     afsNotificationQuery rightJoin($relation) Adds a RIGHT JOIN clause to the query
 * @method     afsNotificationQuery innerJoin($relation) Adds a INNER JOIN clause to the query
 *
 * @method     afsNotification findOne(PropelPDO $con = null) Return the first afsNotification matching the query
 * @method     afsNotification findOneOrCreate(PropelPDO $con = null) Return the first afsNotification matching the query, or a new afsNotification object populated from the query conditions when no match is found
 *
 * @method     afsNotification findOneByMessage(string $message) Return the first afsNotification filtered by the message column
 * @method     afsNotification findOneByMessageType(string $message_type) Return the first afsNotification filtered by the message_type column
 * @method     afsNotification findOneByUser(string $user) Return the first afsNotification filtered by the user column
 * @method     afsNotification findOneByIp(string $ip) Return the first afsNotification filtered by the ip column
 * @method     afsNotification findOneByCreatedAt(string $created_at) Return the first afsNotification filtered by the created_at column
 * @method     afsNotification findOneById(int $id) Return the first afsNotification filtered by the id column
 *
 * @method     array findByMessage(string $message) Return afsNotification objects filtered by the message column
 * @method     array findByMessageType(string $message_type) Return afsNotification objects filtered by the message_type column
 * @method     array findByUser(string $user) Return afsNotification objects filtered by the user column
 * @method     array findByIp(string $ip) Return afsNotification objects filtered by the ip column
 * @method     array findByCreatedAt(string $created_at) Return afsNotification objects filtered by the created_at column
 * @method     array findById(int $id) Return afsNotification objects filtered by the id column
 *
 * @package    propel.generator.plugins.appFlowerStudioPlugin.lib.model.om
 */
abstract class BaseafsNotificationQuery extends ModelCriteria
{
	
	/**
	 * Initializes internal state of BaseafsNotificationQuery object.
	 *
	 * @param     string $dbName The dabase name
	 * @param     string $modelName The phpName of a model, e.g. 'Book'
	 * @param     string $modelAlias The alias for the model in this query, e.g. 'b'
	 */
	public function __construct($dbName = 'propel', $modelName = 'afsNotification', $modelAlias = null)
	{
		parent::__construct($dbName, $modelName, $modelAlias);
	}

	/**
	 * Returns a new afsNotificationQuery object.
	 *
	 * @param     string $modelAlias The alias of a model in the query
	 * @param     Criteria $criteria Optional Criteria to build the query from
	 *
	 * @return    afsNotificationQuery
	 */
	public static function create($modelAlias = null, $criteria = null)
	{
		if ($criteria instanceof afsNotificationQuery) {
			return $criteria;
		}
		$query = new afsNotificationQuery();
		if (null !== $modelAlias) {
			$query->setModelAlias($modelAlias);
		}
		if ($criteria instanceof Criteria) {
			$query->mergeWith($criteria);
		}
		return $query;
	}

	/**
	 * Find object by primary key.
	 * Propel uses the instance pool to skip the database if the object exists.
	 * Go fast if the query is untouched.
	 *
	 * <code>
	 * $obj  = $c->findPk(12, $con);
	 * </code>
	 *
	 * @param     mixed $key Primary key to use for the query
	 * @param     PropelPDO $con an optional connection object
	 *
	 * @return    afsNotification|array|mixed the result, formatted by the current formatter
	 */
	public function findPk($key, $con = null)
	{
		if ($key === null) {
			return null;
		}
		if ((null !== ($obj = afsNotificationPeer::getInstanceFromPool((string) $key))) && !$this->formatter) {
			// the object is alredy in the instance pool
			return $obj;
		}
		if ($con === null) {
			$con = Propel::getConnection(afsNotificationPeer::DATABASE_NAME, Propel::CONNECTION_READ);
		}
		$this->basePreSelect($con);
		if ($this->formatter || $this->modelAlias || $this->with || $this->select
		 || $this->selectColumns || $this->asColumns || $this->selectModifiers
		 || $this->map || $this->having || $this->joins) {
			return $this->findPkComplex($key, $con);
		} else {
			return $this->findPkSimple($key, $con);
		}
	}

	/**
	 * Find object by primary key using raw SQL to go fast.
	 * Bypass doSelect() and the object formatter by using generated code.
	 *
	 * @param     mixed $key Primary key to use for the query
	 * @param     PropelPDO $con A connection object
	 *
	 * @return    afsNotification A model object, or null if the key is not found
	 */
	protected function findPkSimple($key, $con)
	{
		$sql = 'SELECT `MESSAGE`, `MESSAGE_TYPE`, `USER`, `IP`, `CREATED_AT`, `ID` FROM `afs_notification` WHERE `ID` = :p0';
		try {
			$stmt = $con->prepare($sql);
			$stmt->bindValue(':p0', $key, PDO::PARAM_INT);
			$stmt->execute();
		} catch (Exception $e) {
			Propel::log($e->getMessage(), Propel::LOG_ERR);
			throw new PropelException(sprintf('Unable to execute SELECT statement [%s]', $sql), $e);
		}
		$obj = null;
		if ($row = $stmt->fetch(PDO::FETCH_NUM)) {
			$obj = new afsNotification();
			$obj->hydrate($row);
			afsNotificationPeer::addInstanceToPool($obj, (string) $row[0]);
		}
		$stmt->closeCursor();

		return $obj;
	}

	/**
	 * Find object by primary key.
	 *
	 * @param     mixed $key Primary key to use for the query
	 * @param     PropelPDO $con A connection object
	 *
	 * @return    afsNotification|array|mixed the result, formatted by the current formatter
	 */
	protected function findPkComplex($key, $con)
	{
		// As the query uses a PK condition, no limit(1) is necessary.
		$criteria = $this->isKeepQuery() ? clone $this : $this;
		$stmt = $criteria
			->filterByPrimaryKey($key)
			->doSelect($con);
		return $criteria->getFormatter()->init($criteria)->formatOne($stmt);
	}

	/**
	 * Find objects by primary key
	 * <code>
	 * $objs = $c->findPks(array(12, 56, 832), $con);
	 * </code>
	 * @param     array $keys Primary keys to use for the query
	 * @param     PropelPDO $con an optional connection object
	 *
	 * @return    PropelObjectCollection|array|mixed the list of results, formatted by the current formatter
	 */
	public function findPks($keys, $con = null)
	{
		if ($con === null) {
			$con = Propel::getConnection($this->getDbName(), Propel::CONNECTION_READ);
		}
		$this->basePreSelect($con);
		$criteria = $this->isKeepQuery() ? clone $this : $this;
		$stmt = $criteria
			->filterByPrimaryKeys($keys)
			->doSelect($con);
		return $criteria->getFormatter()->init($criteria)->format($stmt);
	}

	/**
	 * Filter the query by primary key
	 *
	 * @param     mixed $key Primary key to use for the query
	 *
	 * @return    afsNotificationQuery The current query, for fluid interface
	 */
	public function filterByPrimaryKey($key)
	{
		return $this->addUsingAlias(afsNotificationPeer::ID, $key, Criteria::EQUAL);
	}

	/**
	 * Filter the query by a list of primary keys
	 *
	 * @param     array $keys The list of primary key to use for the query
	 *
	 * @return    afsNotificationQuery The current query, for fluid interface
	 */
	public function filterByPrimaryKeys($keys)
	{
		return $this->addUsingAlias(afsNotificationPeer::ID, $keys, Criteria::IN);
	}

	/**
	 * Filter the query on the message column
	 *
	 * Example usage:
	 * <code>
	 * $query->filterByMessage('fooValue');   // WHERE message = 'fooValue'
	 * $query->filterByMessage('%fooValue%'); // WHERE message LIKE '%fooValue%'
	 * </code>
	 *
	 * @param     string $message The value to use as filter.
	 *              Accepts wildcards (* and % trigger a LIKE)
	 * @param     string $comparison Operator to use for the column comparison, defaults to Criteria::EQUAL
	 *
	 * @return    afsNotificationQuery The current query, for fluid interface
	 */
	public function filterByMessage($message = null, $comparison = null)
	{
		if (null === $comparison) {
			if (is_array($message)) {
				$comparison = Criteria::IN;
			} elseif (preg_match('/[\%\*]/', $message)) {
				$message = str_replace('*', '%', $message);
				$comparison = Criteria::LIKE;
			}
		}
		return $this->addUsingAlias(afsNotificationPeer::MESSAGE, $message, $comparison);
	}

	/**
	 * Filter the query on the message_type column
	 *
	 * Example usage:
	 * <code>
	 * $query->filterByMessageType('fooValue');   // WHERE message_type = 'fooValue'
	 * $query->filterByMessageType('%fooValue%'); // WHERE message_type LIKE '%fooValue%'
	 * </code>
	 *
	 * @param     string $messageType The value to use as filter.
	 *              Accepts wildcards (* and % trigger a LIKE)
	 * @param     string $comparison Operator to use for the column comparison, defaults to Criteria::EQUAL
	 *
	 * @return    afsNotificationQuery The current query, for fluid interface
	 */
	public function filterByMessageType($messageType = null, $comparison = null)
	{
		if (null === $comparison) {
			if (is_array($messageType)) {
				$comparison = Criteria::IN;
			} elseif (preg_match('/[\%\*]/', $messageType)) {
				$messageType = str_replace('*', '%', $messageType);
				$comparison = Criteria::LIKE;
			}
		}
		return $this->addUsingAlias(afsNotificationPeer::MESSAGE_TYPE, $messageType, $comparison);
	}

	/**
	 * Filter the query on the user column
	 *
	 * Example usage:
	 * <code>
	 * $query->filterByUser('fooValue');   // WHERE user = 'fooValue'
	 * $query->filterByUser('%fooValue%'); // WHERE user LIKE '%fooValue%'
	 * </code>
	 *
	 * @param     string $user The value to use as filter.
	 *              Accepts wildcards (* and % trigger a LIKE)
	 * @param     string $comparison Operator to use for the column comparison, defaults to Criteria::EQUAL
	 *
	 * @return    afsNotificationQuery The current query, for fluid interface
	 */
	public function filterByUser($user = null, $comparison = null)
	{
		if (null === $comparison) {
			if (is_array($user)) {
				$comparison = Criteria::IN;
			} elseif (preg_match('/[\%\*]/', $user)) {
				$user = str_replace('*', '%', $user);
				$comparison = Criteria::LIKE;
			}
		}
		return $this->addUsingAlias(afsNotificationPeer::USER, $user, $comparison);
	}

	/**
	 * Filter the query on the ip column
	 *
	 * Example usage:
	 * <code>
	 * $query->filterByIp('fooValue');   // WHERE ip = 'fooValue'
	 * $query->filterByIp('%fooValue%'); // WHERE ip LIKE '%fooValue%'
	 * </code>
	 *
	 * @param     string $ip The value to use as filter.
	 *              Accepts wildcards (* and % trigger a LIKE)
	 * @param     string $comparison Operator to use for the column comparison, defaults to Criteria::EQUAL
	 *
	 * @return    afsNotificationQuery The current query, for fluid interface
	 */
	public function filterByIp($ip = null, $comparison = null)
	{
		if (null === $comparison) {
			if (is_array($ip)) {
				$comparison = Criteria::IN;
			} elseif (preg_match('/[\%\*]/', $ip)) {
				$ip = str_replace('*', '%', $ip);
				$comparison = Criteria::LIKE;
			}
		}
		return $this->addUsingAlias(afsNotificationPeer::IP, $ip, $comparison);
	}

	/**
	 * Filter the query on the created_at column
	 *
	 * Example usage:
	 * <code>
	 * $query->filterByCreatedAt('2011-03-14'); // WHERE created_at = '2011-03-14'
	 * $query->filterByCreatedAt('now'); // WHERE created_at = '2011-03-14'
	 * $query->filterByCreatedAt(array('max' => 'yesterday')); // WHERE created_at > '2011-03-13'
	 * </code>
	 *
	 * @param     mixed $createdAt The value to use as filter.
	 *              Values can be integers (unix timestamps), DateTime objects, or strings.
	 *              Empty strings are treated as NULL.
	 *              Use scalar values for equality.
	 *              Use array values for in_array() equivalent.
	 *              Use associative array('min' => $minValue, 'max' => $maxValue) for intervals.
	 * @param     string $comparison Operator to use for the column comparison, defaults to Criteria::EQUAL
	 *
	 * @return    afsNotificationQuery The current query, for fluid interface
	 */
	public function filterByCreatedAt($createdAt = null, $comparison = null)
	{
		if (is_array($createdAt)) {
			$useMinMax = false;
			if (isset($createdAt['min'])) {
				$this->addUsingAlias(afsNotificationPeer::CREATED_AT, $createdAt['min'], Criteria::GREATER_EQUAL);
				$useMinMax = true;
			}
			if (isset($createdAt['max'])) {
				$this->addUsingAlias(afsNotificationPeer::CREATED_AT, $createdAt['max'], Criteria::LESS_EQUAL);
				$useMinMax = true;
			}
			if ($useMinMax) {
				return $this;
			}
			if (null === $comparison) {
				$comparison = Criteria::IN;
			}
		}
		return $this->addUsingAlias(afsNotificationPeer::CREATED_AT, $createdAt, $comparison);
	}

	/**
	 * Filter the query on the id column
	 *
	 * Example usage:
	 * <code>
	 * $query->filterById(1234); // WHERE id = 1234
	 * $query->filterById(array(12, 34)); // WHERE id IN (12, 34)
	 * $query->filterById(array('min' => 12)); // WHERE id > 12
	 * </code>
	 *
	 * @param     mixed $id The value to use as filter.
	 *              Use scalar values for equality.
	 *              Use array values for in_array() equivalent.
	 *              Use associative array('min' => $minValue, 'max' => $maxValue) for intervals.
	 * @param     string $comparison Operator to use for the column comparison, defaults to Criteria::EQUAL
	 *
	 * @return    afsNotificationQuery The current query, for fluid interface
	 */
	public function filterById($id = null, $comparison = null)
	{
		if (is_array($id) && null === $comparison) {
			$comparison = Criteria::IN;
		}
		return $this->addUsingAlias(afsNotificationPeer::ID, $id, $comparison);
	}

	/**
	 * Exclude object from result
	 *
	 * @param     afsNotification $afsNotification Object to remove from the list of results
	 *
	 * @return    afsNotificationQuery The current query, for fluid interface
	 */
	public function prune($afsNotification = null)
	{
		if ($afsNotification) {
			$this->addUsingAlias(afsNotificationPeer::ID, $afsNotification->getId(), Criteria::NOT_EQUAL);
		}

		return $this;
	}

} // BaseafsNotificationQuery
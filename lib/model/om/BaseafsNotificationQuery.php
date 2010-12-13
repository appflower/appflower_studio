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
 * @method     afsNotification findOneByUser(int $user) Return the first afsNotification filtered by the user column
 * @method     afsNotification findOneByIp(string $ip) Return the first afsNotification filtered by the ip column
 * @method     afsNotification findOneByCreatedAt(string $created_at) Return the first afsNotification filtered by the created_at column
 * @method     afsNotification findOneById(int $id) Return the first afsNotification filtered by the id column
 *
 * @method     array findByMessage(string $message) Return afsNotification objects filtered by the message column
 * @method     array findByMessageType(string $message_type) Return afsNotification objects filtered by the message_type column
 * @method     array findByUser(int $user) Return afsNotification objects filtered by the user column
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
	 * Find object by primary key
	 * Use instance pooling to avoid a database query if the object exists
	 * <code>
	 * $obj  = $c->findPk(12, $con);
	 * </code>
	 * @param     mixed $key Primary key to use for the query
	 * @param     PropelPDO $con an optional connection object
	 *
	 * @return    afsNotification|array|mixed the result, formatted by the current formatter
	 */
	public function findPk($key, $con = null)
	{
		if ((null !== ($obj = afsNotificationPeer::getInstanceFromPool((string) $key))) && $this->getFormatter()->isObjectFormatter()) {
			// the object is alredy in the instance pool
			return $obj;
		} else {
			// the object has not been requested yet, or the formatter is not an object formatter
			$criteria = $this->isKeepQuery() ? clone $this : $this;
			$stmt = $criteria
				->filterByPrimaryKey($key)
				->getSelectStatement($con);
			return $criteria->getFormatter()->init($criteria)->formatOne($stmt);
		}
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
		$criteria = $this->isKeepQuery() ? clone $this : $this;
		return $this
			->filterByPrimaryKeys($keys)
			->find($con);
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
	 * @param     string $message The value to use as filter.
	 *            Accepts wildcards (* and % trigger a LIKE)
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
	 * @param     string $messageType The value to use as filter.
	 *            Accepts wildcards (* and % trigger a LIKE)
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
	 * @param     int|array $user The value to use as filter.
	 *            Accepts an associative array('min' => $minValue, 'max' => $maxValue)
	 * @param     string $comparison Operator to use for the column comparison, defaults to Criteria::EQUAL
	 *
	 * @return    afsNotificationQuery The current query, for fluid interface
	 */
	public function filterByUser($user = null, $comparison = null)
	{
		if (is_array($user)) {
			$useMinMax = false;
			if (isset($user['min'])) {
				$this->addUsingAlias(afsNotificationPeer::USER, $user['min'], Criteria::GREATER_EQUAL);
				$useMinMax = true;
			}
			if (isset($user['max'])) {
				$this->addUsingAlias(afsNotificationPeer::USER, $user['max'], Criteria::LESS_EQUAL);
				$useMinMax = true;
			}
			if ($useMinMax) {
				return $this;
			}
			if (null === $comparison) {
				$comparison = Criteria::IN;
			}
		}
		return $this->addUsingAlias(afsNotificationPeer::USER, $user, $comparison);
	}

	/**
	 * Filter the query on the ip column
	 * 
	 * @param     string $ip The value to use as filter.
	 *            Accepts wildcards (* and % trigger a LIKE)
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
	 * @param     string|array $createdAt The value to use as filter.
	 *            Accepts an associative array('min' => $minValue, 'max' => $maxValue)
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
	 * @param     int|array $id The value to use as filter.
	 *            Accepts an associative array('min' => $minValue, 'max' => $maxValue)
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

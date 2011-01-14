<?php


/**
 * Base class that represents a query for the 'project' table.
 *
 * 
 *
 * @method     ProjectQuery orderByName($order = Criteria::ASC) Order by the name column
 * @method     ProjectQuery orderByPath($order = Criteria::ASC) Order by the path column
 * @method     ProjectQuery orderBySlug($order = Criteria::ASC) Order by the slug column
 * @method     ProjectQuery orderById($order = Criteria::ASC) Order by the id column
 *
 * @method     ProjectQuery groupByName() Group by the name column
 * @method     ProjectQuery groupByPath() Group by the path column
 * @method     ProjectQuery groupBySlug() Group by the slug column
 * @method     ProjectQuery groupById() Group by the id column
 *
 * @method     ProjectQuery leftJoin($relation) Adds a LEFT JOIN clause to the query
 * @method     ProjectQuery rightJoin($relation) Adds a RIGHT JOIN clause to the query
 * @method     ProjectQuery innerJoin($relation) Adds a INNER JOIN clause to the query
 *
 * @method     Project findOne(PropelPDO $con = null) Return the first Project matching the query
 * @method     Project findOneOrCreate(PropelPDO $con = null) Return the first Project matching the query, or a new Project object populated from the query conditions when no match is found
 *
 * @method     Project findOneByName(string $name) Return the first Project filtered by the name column
 * @method     Project findOneByPath(string $path) Return the first Project filtered by the path column
 * @method     Project findOneBySlug(string $slug) Return the first Project filtered by the slug column
 * @method     Project findOneById(int $id) Return the first Project filtered by the id column
 *
 * @method     array findByName(string $name) Return Project objects filtered by the name column
 * @method     array findByPath(string $path) Return Project objects filtered by the path column
 * @method     array findBySlug(string $slug) Return Project objects filtered by the slug column
 * @method     array findById(int $id) Return Project objects filtered by the id column
 *
 * @package    propel.generator.plugins.appFlowerStudioPlugin.lib.model.om
 */
abstract class BaseProjectQuery extends ModelCriteria
{

	/**
	 * Initializes internal state of BaseProjectQuery object.
	 *
	 * @param     string $dbName The dabase name
	 * @param     string $modelName The phpName of a model, e.g. 'Book'
	 * @param     string $modelAlias The alias for the model in this query, e.g. 'b'
	 */
	public function __construct($dbName = 'propel', $modelName = 'Project', $modelAlias = null)
	{
		parent::__construct($dbName, $modelName, $modelAlias);
	}

	/**
	 * Returns a new ProjectQuery object.
	 *
	 * @param     string $modelAlias The alias of a model in the query
	 * @param     Criteria $criteria Optional Criteria to build the query from
	 *
	 * @return    ProjectQuery
	 */
	public static function create($modelAlias = null, $criteria = null)
	{
		if ($criteria instanceof ProjectQuery) {
			return $criteria;
		}
		$query = new ProjectQuery();
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
	 * @return    Project|array|mixed the result, formatted by the current formatter
	 */
	public function findPk($key, $con = null)
	{
		if ((null !== ($obj = ProjectPeer::getInstanceFromPool((string) $key))) && $this->getFormatter()->isObjectFormatter()) {
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
	 * @return    ProjectQuery The current query, for fluid interface
	 */
	public function filterByPrimaryKey($key)
	{
		return $this->addUsingAlias(ProjectPeer::ID, $key, Criteria::EQUAL);
	}

	/**
	 * Filter the query by a list of primary keys
	 *
	 * @param     array $keys The list of primary key to use for the query
	 *
	 * @return    ProjectQuery The current query, for fluid interface
	 */
	public function filterByPrimaryKeys($keys)
	{
		return $this->addUsingAlias(ProjectPeer::ID, $keys, Criteria::IN);
	}

	/**
	 * Filter the query on the name column
	 * 
	 * @param     string $name The value to use as filter.
	 *            Accepts wildcards (* and % trigger a LIKE)
	 * @param     string $comparison Operator to use for the column comparison, defaults to Criteria::EQUAL
	 *
	 * @return    ProjectQuery The current query, for fluid interface
	 */
	public function filterByName($name = null, $comparison = null)
	{
		if (null === $comparison) {
			if (is_array($name)) {
				$comparison = Criteria::IN;
			} elseif (preg_match('/[\%\*]/', $name)) {
				$name = str_replace('*', '%', $name);
				$comparison = Criteria::LIKE;
			}
		}
		return $this->addUsingAlias(ProjectPeer::NAME, $name, $comparison);
	}

	/**
	 * Filter the query on the path column
	 * 
	 * @param     string $path The value to use as filter.
	 *            Accepts wildcards (* and % trigger a LIKE)
	 * @param     string $comparison Operator to use for the column comparison, defaults to Criteria::EQUAL
	 *
	 * @return    ProjectQuery The current query, for fluid interface
	 */
	public function filterByPath($path = null, $comparison = null)
	{
		if (null === $comparison) {
			if (is_array($path)) {
				$comparison = Criteria::IN;
			} elseif (preg_match('/[\%\*]/', $path)) {
				$path = str_replace('*', '%', $path);
				$comparison = Criteria::LIKE;
			}
		}
		return $this->addUsingAlias(ProjectPeer::PATH, $path, $comparison);
	}

	/**
	 * Filter the query on the slug column
	 * 
	 * @param     string $slug The value to use as filter.
	 *            Accepts wildcards (* and % trigger a LIKE)
	 * @param     string $comparison Operator to use for the column comparison, defaults to Criteria::EQUAL
	 *
	 * @return    ProjectQuery The current query, for fluid interface
	 */
	public function filterBySlug($slug = null, $comparison = null)
	{
		if (null === $comparison) {
			if (is_array($slug)) {
				$comparison = Criteria::IN;
			} elseif (preg_match('/[\%\*]/', $slug)) {
				$slug = str_replace('*', '%', $slug);
				$comparison = Criteria::LIKE;
			}
		}
		return $this->addUsingAlias(ProjectPeer::SLUG, $slug, $comparison);
	}

	/**
	 * Filter the query on the id column
	 * 
	 * @param     int|array $id The value to use as filter.
	 *            Accepts an associative array('min' => $minValue, 'max' => $maxValue)
	 * @param     string $comparison Operator to use for the column comparison, defaults to Criteria::EQUAL
	 *
	 * @return    ProjectQuery The current query, for fluid interface
	 */
	public function filterById($id = null, $comparison = null)
	{
		if (is_array($id) && null === $comparison) {
			$comparison = Criteria::IN;
		}
		return $this->addUsingAlias(ProjectPeer::ID, $id, $comparison);
	}

	/**
	 * Exclude object from result
	 *
	 * @param     Project $project Object to remove from the list of results
	 *
	 * @return    ProjectQuery The current query, for fluid interface
	 */
	public function prune($project = null)
	{
		if ($project) {
			$this->addUsingAlias(ProjectPeer::ID, $project->getId(), Criteria::NOT_EQUAL);
	  }
	  
		return $this;
	}

} // BaseProjectQuery

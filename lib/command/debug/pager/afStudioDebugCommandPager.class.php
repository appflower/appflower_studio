<?php 
/**
 * Debug Command Pager class
 * 
 * @author Sergey Startsev
 */
class afStudioDebugCommandPager 
{
	/**
	 * Resource
	 */
	private $_resource;
	
	/**
	 * Current page
	 */
	private $_current_page;
	
	/**
	 * Shift page next and previous
	 */
	private $_next_page;
	private $_previous_page;
	
	/**
	 * Limit page first and last
	 */
	private $_first_page = 1;
	private $_last_page;
	
	/**
	 * Total found pages
	 */
	private $_total_pages;
	
	/**
	 * Limiting and offset 
	 */
	private $_limit;
	private $_offset;
    
    /**
     * Total found elements
     */
	private $_total_found;
	
	/**
	 * Is visible
	 */
	private $_visible;
	
	
	public function __construct($total, $page = 1, $limit = 0) {
		$this->_current_page = $page;
		$this->_limit = ($limit == 0) ? sfConfig::get('app_per_page') : $limit;
		
		$this->_total_found = $total;
		$this->_total_pages = ceil($this->_total_found / $this->_limit);
		
		// Alias for last page
		$this->_last_page = $this->_total_pages;
	}
	
	/**
	 * Is visible page
	 *
	 * @return boolean
	 * @author Sergey Startsev
	 */
	public function isVisible() {
		if (empty($this->_visible)) {
			$this->_visible = ($this->_total_found > $this->_limit);
		}
		
		return $this->_visible;
	}
	
	/**
	 * Next package
	 *
	 * @param string $count 
	 * @return mixed
	 * @author Sergey Startsev
	 */
	public function getPackageNext($count = 2) {
		if (($this->_current_page + $count) >= $this->_total_pages ) {
			$count = $this->_total_pages - $this->_current_page;
		}
		$result = array();
		for ($i = $this->_current_page + 1; $i <= ($this->_current_page + $count); $i++) {
			$result[$i] = $i;
		}
		return $result;
	}
	
	/**
	 * Previous package
	 *
	 * @param string $count 
	 * @return mixed
	 * @author Sergey Startsev
	 */
	public function getPackagePrevious($count = 2) {
		if (($this->_current_page - $count) <= 1 ) {
			$start = 1;
		} else {
			$start = $this->_current_page - $count;
		}
		
		$result = array();
		for ($i = $start; $i < $this->_current_page; $i++) {
			$result[$i] = $i;
		}
		return $result;
	}
	
	public function setPage($page) {
		$this->_current_page = $page;
	}
	
	/**
	 * Getting current page
	 *
	 * @return int
	 * @author Sergey Startsev
	 */
	public function getPage() {
		return $this->_current_page;
	}
    
    /**
     * Getting limit 
     *
     * @return int
     * @author Sergey Startsev
     */
	public function getLimit() {
		return $this->_limit;
	}
	
	/**
	 * Getting offset
	 *
	 * @return int
	 * @author Sergey Startsev
	 */
	public function getOffset() {
		return $this->_offset;
	}
	
	/**
	 * Getting last page
	 *
	 * @return int
	 * @author Sergey Startsev
	 */
	public function getLastPage() {
		return $this->_last_page;
	}
	
	/**
	 * Getting first page
	 *
	 * @return int
	 * @author Sergey Startsev
	 */
	public function getFirstPage() {
		return $this->_first_page;
	}
	
	/**
	 * Getting next page
	 *
	 * @return int
	 * @author Sergey Startsev
	 */
	public function getNext() {
		if (empty($this->_next_page)) {
			$this->_next_page = (($this->_current_page + 1) >= $this->_total_pages) ? $this->_total_pages : ($this->_current_page + 1);
		}
		return $this->_next_page;
	}
	
	/**
	 * Getting previous page
	 *
	 * @return int
	 * @author Sergey Startsev
	 */
	public function getPrevious() {
		if (empty($this->_previous_page)) {
			$this->_previous_page = (($this->_current_page - 1) <= 1) ? 1 : ($this->_current_page - 1);
		}
		return $this->_previous_page;
	}
	
}
